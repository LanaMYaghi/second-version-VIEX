import React, { useState } from 'react';
import FormFooter from './FormFooter';

function Form({ linkTo, textLink, textFooter, inputData = [], onSubmit }) {
    const [formValues, setFormValues] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formValues);
        }
    };

    return (
        <div className='w-full max-w-md mx-auto px-4 sm:px-0'>
            <form onSubmit={handleSubmit} className='w-full space-y-4'>
                {inputData.map((item, index) => (
                    <div key={index} className="w-full">

                        {/* 1. مجموعة حقول داخل مصفوفة (Inputs Group) */}
                        {item.inputs ? (
                            item.inputs.map((input, i) => (
                                <div key={i} className="mb-4">
                                    <label htmlFor={input.name} className='text-sm sm:text-base font-medium text-slate-700 mb-1.5 block'>
                                        {input.label}
                                    </label>
                                    <input
                                        type={input.type || 'text'}
                                        placeholder={input.placeholder || ''}
                                        name={input.name}
                                        id={input.name}
                                        value={formValues[input.name] || ''}
                                        className='w-full h-11 sm:h-12 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl px-4 text-sm sm:text-base bg-white transition-all'
                                        onChange={handleChange}
                                    />
                                </div>
                            ))
                        ) : item.type === "textarea" ? (

                            /* 2. حقل النص الطويل (Textarea) */
                            <div className="mb-4">
                                <label htmlFor={item.name} className='text-sm sm:text-base font-medium text-slate-700 mb-1.5 block'>
                                    {item.label}
                                </label>
                                <textarea
                                    name={item.name}
                                    id={item.name}
                                    placeholder={item.placeholder || ''}
                                    value={formValues[item.name] || ''}
                                    onChange={handleChange}
                                    className='w-full h-32 sm:h-36 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl p-3 text-sm sm:text-base bg-white transition-all resize-none'
                                ></textarea>
                            </div>

                        ) : item.type === "select" ? (

                            /* 3. القائمة المنسدلة (Select - للأستاذ والمستوى) - المكان الجديد رقم 1 */
                            <div className="mb-4">
                                <label htmlFor={item.name} className='text-sm sm:text-base font-medium text-slate-700 mb-1.5 block'>
                                    {item.label}
                                </label>
                                <select
                                    name={item.name}
                                    id={item.name}
                                    value={formValues[item.name] || ''}
                                    onChange={handleChange}
                                    className='w-full h-11 sm:h-12 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl px-4 text-sm sm:text-base bg-white transition-all'
                                >
                                    <option value="">{item.placeholder || 'اختر...'}</option>
                                    {item.options?.map((opt, idx) => (
                                        <option key={idx} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        ) : item.type === "checkbox-group" ? (

                            /* 4. خانات الاختيار (Checkboxes - للأيام) - المكان الجديد رقم 2 */
                            <div className="mb-4">
                                <label className='text-sm sm:text-base font-medium text-slate-700 mb-2 block'>
                                    {item.label}
                                </label>
                                <div className="flex flex-wrap gap-4">
                                    {item.options?.map((opt, idx) => (
                                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name={item.name}
                                                value={opt.value}
                                                checked={Array.isArray(formValues[item.name]) && formValues[item.name].includes(opt.value)}
                                                onChange={(e) => {
                                                    const currentValues = formValues[item.name] || [];
                                                    let updatedValues;
                                                    if (e.target.checked) {
                                                        updatedValues = [...currentValues, opt.value];
                                                    } else {
                                                        updatedValues = currentValues.filter((v) => v !== opt.value);
                                                    }
                                                    setFormValues((prev) => ({ ...prev, [item.name]: updatedValues }));
                                                }}
                                                className="w-4 h-4 text-[#3A5B22] border-slate-300 rounded focus:ring-[#3A5B22]"
                                            />
                                            <span className="text-sm text-slate-700">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        ) : item.type === "submit" ? (

                            /* 5. زر الإرسال (Submit Button) */
                            <button
                                type="submit"
                                name={item.name}
                                className={`w-full h-11 sm:h-12 block outline-none rounded-xl px-4 my-2 text-center text-white font-semibold bg-[#3A5B22] hover:bg-black transition-colors text-sm sm:text-base shadow-sm ${item.className || ''}`}
                            >
                                {item.text}
                            </button>

                        ) : (

                            /* 6. حقل فردي عادي (Single Direct Input) */
                            <div className="mb-4">
                                <label htmlFor={item.name} className='text-sm sm:text-base font-medium text-slate-700 mb-1.5 block'>
                                    {item.label}
                                </label>
                                <input
                                    type={item.type || 'text'}
                                    placeholder={item.placeholder || ''}
                                    name={item.name}
                                    id={item.name}
                                    value={formValues[item.name] || ''}
                                    className='w-full h-11 sm:h-12 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl px-4 text-sm sm:text-base bg-white transition-all'
                                    onChange={handleChange}
                                />
                            </div>

                        )}

                    </div>
                ))}

                {/* تذييلة الفورم */}
                {textFooter && (
                    <div className="pt-2">
                        <FormFooter
                            linkTo={linkTo}
                            textFooter={textFooter}
                            textLink={textLink}
                            className={'text-center text-xs sm:text-sm text-slate-600'}
                        />
                    </div>
                )}
            </form>
        </div>
    );
}

export default Form;