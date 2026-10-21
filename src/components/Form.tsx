import React, { useEffect, useState } from "react";
import FormFooter from "./FormFooter";

const inputClass =
  "w-full h-11 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl px-4 text-sm bg-white transition-all";

const labelClass = "text-sm font-medium text-slate-700 mb-1.5 block";

/**
 * مهم: initialValues لازم يكون object ثابت (useMemo) أو null.
 * لو انعمل object جديد بكل render رح يمسح اللي عم تكتبيه.
 */
function Form({
  linkTo,
  textLink,
  textFooter,
  inputData = [],
  onSubmit,
  initialValues = null,
  isAuth = false,
  submitting = false,
}) {
  const [formValues, setFormValues] = useState(initialValues || {});

  useEffect(() => {
    setFormValues(initialValues || {});
  }, [initialValues]);

  const setValue = (name, value) =>
    setFormValues((prev) => ({ ...prev, [name]: value }));

  const handleChange = (e) => setValue(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSubmit) return;
    const ok = await onSubmit(formValues);
    // بعد إضافة ناجحة (مو تعديل) منفضّي الفورم
    if (ok === true && !initialValues) setFormValues({});
  };

  const wrap = isAuth ? "w-full" : "flex-1 min-w-[200px]";

  const renderInput = (input, key) => (
    <div key={key} className={wrap}>
      <label htmlFor={input.name} className={labelClass}>
        {input.label}
      </label>
      <input
        type={input.type || "text"}
        placeholder={input.placeholder || ""}
        name={input.name}
        id={input.name}
        value={formValues[input.name] ?? ""}
        className={inputClass}
        onChange={handleChange}
        autoComplete={input.type === "password" ? "new-password" : "off"}
      />
    </div>
  );

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={
            isAuth ? "space-y-4 w-full" : "flex flex-wrap items-end gap-4 w-full"
          }
        >
          {inputData.map((item, index) => (
            <React.Fragment key={index}>
              {item.inputs ? (
                item.inputs.map((input, i) => renderInput(input, i))
              ) : item.type === "textarea" ? (
                <div className="w-full">
                  <label htmlFor={item.name} className={labelClass}>
                    {item.label}
                  </label>
                  <textarea
                    name={item.name}
                    id={item.name}
                    placeholder={item.placeholder || ""}
                    value={formValues[item.name] ?? ""}
                    onChange={handleChange}
                    className="w-full h-24 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl p-3 text-sm bg-white transition-all resize-none"
                  />
                </div>
              ) : item.type === "select" ? (
                <div className={wrap}>
                  <label htmlFor={item.name} className={labelClass}>
                    {item.label}
                  </label>
                  <select
                    name={item.name}
                    id={item.name}
                    value={formValues[item.name] ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">{item.placeholder || "Select..."}</option>
                    {item.options?.map((opt, idx) => (
                      <option key={idx} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : item.type === "checkbox-group" ? (
                <div className="w-full my-2">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    {item.label}
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {item.options?.map((opt, idx) => {
                      const current = Array.isArray(formValues[item.name])
                        ? formValues[item.name]
                        : [];
                      return (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={opt.value}
                            checked={current.includes(opt.value)}
                            onChange={(e) =>
                              setValue(
                                item.name,
                                e.target.checked
                                  ? [...current, opt.value]
                                  : current.filter((v) => v !== opt.value)
                              )
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-slate-700">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : item.type === "submit" ? (
                <div className={isAuth ? "w-full pt-2" : "w-full sm:w-auto mt-2"}>
                  <button
                    type="submit"
                    disabled={submitting || item.disabled}
                    className={`h-11 outline-none rounded-xl px-6 text-center font-semibold text-sm shadow-sm disabled:opacity-50 ${
                      isAuth ? "w-full" : "w-full sm:w-auto"
                    } ${item.className || "bg-[#3A5B22] text-white hover:bg-black transition-colors"}`}
                  >
                    {submitting
                      ? "Saving..."
                      : initialValues
                      ? item.updateText || "Update Changes"
                      : item.text}
                  </button>
                </div>
              ) : (
                renderInput(item, "single")
              )}
            </React.Fragment>
          ))}
        </div>

        {textFooter && (
          <div className="pt-4">
            <FormFooter
              linkTo={linkTo}
              textFooter={textFooter}
              textLink={textLink}
              className="text-center text-xs text-slate-600"
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default Form;
