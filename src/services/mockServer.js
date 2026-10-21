// src/services/mockServer.js
const KEY = "mock_db";
const STUDENT_NAMES = { 5: "Ahmad Omar", 6: "Sara Ali", 7: "Lina Hassan" };

const seed = () => ({
  nextId: 100,
  quizzes: [],
  questions: [],
  answers: [],
  studentQuizzes: [],
});

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? seed();
  } catch {
    return seed();
  }
};
const save = (db) => localStorage.setItem(KEY, JSON.stringify(db));

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const fail = (message) => {
  throw new Error(message);
};

const withAnswers = (db, q) => ({
  ...q,
  answers: db.answers.filter((a) => a.questionId === q.id),
});

const withQuestions = (db, quiz) => ({
  ...quiz,
  questions: db.questions
    .filter((q) => q.quizId === quiz.id)
    .map((q) => withAnswers(db, q)),
});

const insertAnswers = (db, questionId, answers = []) => {
  answers.forEach((a) =>
    db.answers.push({
      id: db.nextId++,
      questionId,
      option: a.option,
      isCorrect: !!a.isCorrect,
    })
  );
};

const removeQuestion = (db, questionId) => {
  db.answers = db.answers.filter((a) => a.questionId !== questionId);
  db.questions = db.questions.filter((q) => q.id !== questionId);
};

export const mockRequest = async (path, options = {}) => {
  await delay();

  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const role = localStorage.getItem("userRole");
  const userId = Number(localStorage.getItem("userId"));
  const db = load();
  db.studentQuizzes ??= []; // لو الـ db القديمة ما فيها هالجدول
  let m;

  // ---------- Auth ----------
  if (method === "POST" && path === "/auth/login") {
    const email = (body.email || "").toLowerCase();
    const found = ["teacher", "admin", "secretary", "student"].find((r) =>
      email.includes(r)
    );
    if (!found)
      fail("Use an email containing: teacher / admin / secretary / student");
    const ids = { teacher: 1, admin: 2, secretary: 3, student: 5 };
    return { token: "mock-token", user: { id: ids[found], role: found } };
  }
  if (method === "POST" && path === "/auth/register") return { ok: true };

  // ---------- الطالب ----------
  if (method === "GET" && path === "/student/quizzes") {
    if (role !== "student") fail("Students only");
    return db.quizzes
      .map((q) => {
        const total = db.questions.filter((x) => x.quizId === q.id).length;
        const attempt = db.studentQuizzes.find(
          (s) => s.quizId === q.id && s.studentId === userId
        );
        return {
          ...q,
          questionsCount: total,
          attempt: attempt ? { mark: attempt.mark, total } : null,
        };
      })
      .filter((q) => q.questionsCount > 0); // الكوييز الفاضي ما بينعرض
  }

  if (method === "GET" && (m = path.match(/^\/quizzes\/(\d+)\/take$/))) {
    if (role !== "student") fail("Students only");
    const quizId = Number(m[1]);
    const quiz = db.quizzes.find((q) => q.id === quizId);
    if (!quiz) fail("Quiz not found");

    const questions = db.questions.filter((q) => q.quizId === quizId);
    const attempt = db.studentQuizzes.find(
      (s) => s.quizId === quizId && s.studentId === userId
    );

    return {
      id: quiz.id,
      title: quiz.title,
      attempt: attempt ? { mark: attempt.mark, total: questions.length } : null,
      // بدون isCorrect أبداً
      questions: attempt
        ? []
        : questions.map((q) => ({
            id: q.id,
            question: q.question,
            answers: db.answers
              .filter((a) => a.questionId === q.id)
              .map(({ id, option }) => ({ id, option })),
          })),
    };
  }

  if (method === "POST" && (m = path.match(/^\/quizzes\/(\d+)\/submit$/))) {
    if (role !== "student") fail("Students only");
    const quizId = Number(m[1]);

    if (
      db.studentQuizzes.some(
        (s) => s.quizId === quizId && s.studentId === userId
      )
    ) {
      fail("You already submitted this quiz");
    }

    const questions = db.questions.filter((q) => q.quizId === quizId);
    let mark = 0;
    questions.forEach((q) => {
      const chosen = (body.answers || []).find((a) => a.questionId === q.id);
      const correct = db.answers.find(
        (a) => a.questionId === q.id && a.isCorrect
      );
      if (chosen && correct && chosen.answerId === correct.id) mark++;
    });

    db.studentQuizzes.push({
      id: db.nextId++,
      quizId,
      studentId: userId,
      mark,
    });
    save(db);
    return { mark, total: questions.length };
  }

  // الطالب ما بيوصل لأي route تاني (خصوصاً اللي فيها isCorrect)
  if (role === "student") fail("Forbidden");

  // ---------- محاكاة صلاحيات الـ backend: الكتابة للأستاذ فقط ----------
  if (method !== "GET" && role !== "teacher")
    fail("Only teachers can modify quizzes");

  // ---------- Quizzes ----------
  if (method === "GET" && (m = path.match(/^\/courses\/(\d+)\/quizzes$/))) {
    const courseId = Number(m[1]);
    return db.quizzes
      .filter((q) => q.courseId === courseId)
      .map((q) => ({
        ...q,
        questionsCount: db.questions.filter((x) => x.quizId === q.id).length,
        submissionsCount: db.studentQuizzes.filter((s) => s.quizId === q.id)
          .length,
      }));
  }

  if (method === "GET" && (m = path.match(/^\/quizzes\/(\d+)\/results$/))) {
    const quizId = Number(m[1]);
    const quiz = db.quizzes.find((q) => q.id === quizId);
    if (!quiz) fail("Quiz not found");

    return {
      quiz: { id: quiz.id, title: quiz.title, courseId: quiz.courseId },
      total: db.questions.filter((q) => q.quizId === quizId).length,
      results: db.studentQuizzes
        .filter((s) => s.quizId === quizId)
        .map((s) => ({
          id: s.id,
          studentId: s.studentId,
          studentName: STUDENT_NAMES[s.studentId] ?? `Student #${s.studentId}`,
          mark: s.mark,
        })),
    };
  }

  if (method === "POST" && path === "/quizzes") {
    const quiz = {
      id: db.nextId++,
      title: body.title,
      courseId: Number(body.courseId),
    };
    db.quizzes.push(quiz);
    save(db);
    return quiz;
  }

  if ((m = path.match(/^\/quizzes\/(\d+)$/))) {
    const id = Number(m[1]);
    const quiz = db.quizzes.find((q) => q.id === id);
    if (!quiz) fail("Quiz not found");

    if (method === "GET") return withQuestions(db, quiz);

    if (method === "PUT") {
      quiz.title = body.title;
      save(db);
      return quiz;
    }

    if (method === "DELETE") {
      db.questions
        .filter((q) => q.quizId === id)
        .forEach((q) => removeQuestion(db, q.id));
      db.quizzes = db.quizzes.filter((q) => q.id !== id);
      db.studentQuizzes = db.studentQuizzes.filter((s) => s.quizId !== id);
      save(db);
      return { id };
    }
  }

  // ---------- Questions ----------
  if (method === "POST" && (m = path.match(/^\/quizzes\/(\d+)\/questions$/))) {
    const q = {
      id: db.nextId++,
      quizId: Number(m[1]),
      question: body.question,
    };
    db.questions.push(q);
    insertAnswers(db, q.id, body.answers);
    save(db);
    return withAnswers(db, q);
  }

  if ((m = path.match(/^\/quizzes\/(\d+)\/questions\/(\d+)$/))) {
    const qid = Number(m[2]);
    const q = db.questions.find((x) => x.id === qid);
    if (!q) fail("Question not found");

    if (method === "PUT") {
      q.question = body.question;
      db.answers = db.answers.filter((a) => a.questionId !== qid);
      insertAnswers(db, qid, body.answers);
      save(db);
      return withAnswers(db, q);
    }

    if (method === "DELETE") {
      removeQuestion(db, qid);
      save(db);
      return { id: qid };
    }
  }

  fail(`Mock: no route for ${method} ${path}`);
};
