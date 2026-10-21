import UsersCrudPage from "../components/UsersCrudPage";
import { getStudentFormFields } from "../constants/formConfigs.js";
import { formatDate } from "../utils/format.js";

const columns = [
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "number_phone", label: "Phone" },
  { key: "father_number", label: "Father's Phone" },
  { label: "Birthday", render: (r) => formatDate(r.birthday) },
  { key: "nationality", label: "Nationality" },
  { key: "gender", label: "Gender" },
];

export default function StudentsPage() {
  return (
    <UsersCrudPage
      type="students"
      title="Students"
      singular="Student"
      getFields={getStudentFormFields}
      columns={columns}
    />
  );
}
