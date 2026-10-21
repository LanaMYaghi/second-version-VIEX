// src/components/QuizModal.jsx
import Modal from "./Modal.jsx";
import Form from "./Form.js";
import { getQuizFormFields } from "../constants/formConfigs.js";

// للإضافة: initialValues = null. للتعديل: مرري الكوييز (الفورم بيعرض "Update Changes" تلقائياً)
function QuizModal({ title, initialValues = null, onSubmit, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <Form
        inputData={getQuizFormFields()}
        onSubmit={onSubmit}
        initialValues={initialValues}
        isAuth={true}
      />
    </Modal>
  );
}

export default QuizModal;
