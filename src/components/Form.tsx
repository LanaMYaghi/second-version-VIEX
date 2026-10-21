import React, { useState, useEffect } from 'react';
import FormFooter from './FormFooter';

function Form({ 
  linkTo, 
  textLink, 
  textFooter, 
  inputData = [], 
  onSubmit, 
  initialValues = null, 
  isAuth = false 
}) {
    const [formValues, setFormValues] = useState(initialValues || {});

    useEffect(() => {
        setFormValues(initialValues || {});
    }, [initialValues]);

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
        <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full">
                <div className={isAuth ? "space-y-4 w-full" : "flex flex-wrap items-end gap-4 w-full"}>
                    {inputData.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.inputs ? (
                                item.inputs.map((input, i) => (
                                    <div key={i} className={isAuth ? "w-full" : "flex-1 min-w-[200px]"}>
                                        <label htmlFor={input.name} className='text-sm font-medium text-slate-700 mb-1.5 block'>
                                            {input.label}
                                        </label>
                                        <input 
                                            type={input.type || 'text'} 
                                            placeholder={input.placeholder || ''} 
                                            name={input.name} 
                                            id={input.name}
                                            value={formValues[input.name] || ''} 
                                            className='w-full h-11 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl px-4 text-sm bg-white transition-all'
                                            onChange={handleChange}  
                                        />
                                    </div>
                                ))
                            ) : item.type === "textarea" ? (
                                <div className={isAuth ? "w-full" : "w-full"}> 
                                    <label htmlFor={item.name} className='text-sm font-medium text-slate-700 mb-1.5 block'>
                                        {item.label}
                                    </label>
                                    <textarea 
                                        name={item.name} 
                                        id={item.name} 
                                        placeholder={item.placeholder || ''} 
                                        value={formValues[item.name] || ''}
                                        onChange={handleChange}
                                        className='w-full h-24 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl p-3 text-sm bg-white transition-all resize-none'
                                    ></textarea>
                                </div>
                            ) : item.type === "select" ? (
                                <div className={isAuth ? "w-full" : "flex-1 min-w-[200px]"}>
                                    <label htmlFor={item.name} className='text-sm font-medium text-slate-700 mb-1.5 block'>
                                        {item.label}
                                    </label>
                                    <select
                                        name={item.name}
                                        id={item.name}
                                        value={formValues[item.name] || ''}
                                        onChange={handleChange}
                                        className='w-full h-11 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl px-4 text-sm bg-white transition-all'
                                    >
                                        <option value="">{item.placeholder || 'Select...'}</option>
                                        {item.options?.map((opt, idx) => (
                                            <option key={idx} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : item.type === "checkbox-group" ? (
                                <div className={isAuth ? "w-full" : "w-full my-2"}>
                                    <label className='text-sm font-medium text-slate-700 mb-2 block'>
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
                            ) : item.type === "question" ? (
                                /* --- دعم بناء السؤال والأجوبة --- */
                                <div className="w-full space-y-5">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                                            Question
                                        </label>
                                        <textarea
                                            value={formValues.question || ""}
                                            onChange={(e) => setFormValues(prev => ({ ...prev, question: e.target.value }))}
                                            placeholder="Write your question here..."
                                            className="w-full h-24 outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl p-3 text-sm bg-white resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                                            Answers <span className="text-slate-400 font-normal">(select the correct one)</span>
                                        </label>
                                        <div className="space-y-3">
                                            {(formValues.answers || []).map((a, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={a.isCorrect}
                                                        onChange={() => {
                                                            const updatedAnswers = (formValues.answers || []).map((ans, i) => ({
                                                                ...ans,
                                                                isCorrect: i === index
                                                            }));
                                                            setFormValues(prev => ({ ...prev, answers: updatedAnswers }));
                                                        }}
                                                        className="w-4 h-4 accent-[#3A5B22]"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={a.option}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const updatedAnswers = (formValues.answers || []).map((ans, i) => 
                                                                i === index ? { ...ans, option: val } : ans
                                                            );
                                                            setFormValues(prev => ({ ...prev, answers: updatedAnswers }));
                                                        }}
                                                        placeholder={`Answer ${index + 1}`}
                                                        className="w-full h-11 outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl px-4 text-sm bg-white transition-all"
                                                    />
                                                    {(formValues.answers || []).length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                let nextAnswers = (formValues.answers || []).filter((_, i) => i !== index);
                                                                if (nextAnswers.length && !nextAnswers.some((ans) => ans.isCorrect)) {
                                                                    nextAnswers[0] = { ...nextAnswers[0], isCorrect: true };
                                                                }
                                                                setFormValues(prev => ({ ...prev, answers: nextAnswers }));
                                                            }}
                                                            className="text-rose-500 text-xl leading-none px-2"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentAnswers = formValues.answers || [];
                                                setFormValues(prev => ({
                                                    ...prev,
                                                    answers: [...currentAnswers, { option: "", isCorrect: false }]
                                                }));
                                            }}
                                            className="mt-3 text-xs font-semibold text-[#3A5B22] hover:underline"
                                        >
                                            + Add another answer
                                        </button>
                                    </div>
                                </div>
                            ) : item.type === "submit" ? (
                                <div className={isAuth ? "w-full pt-2" : "w-full sm:w-auto mt-2"}>
                                    <button
                                        type="submit" 
                                        name={item.name}
                                        disabled={item.disabled}
                                        className={`h-11 outline-none rounded-xl px-6 text-center text-white font-semibold bg-[#3A5B22] hover:bg-black transition-colors text-sm shadow-sm disabled:opacity-50 ${isAuth ? 'w-full' : 'w-full sm:w-auto'} ${item.className || ''}`}
                                    > 
                                        {initialValues ? (item.updateText || 'Update Changes') : item.text}
                                    </button>
                                </div>
                            ) : (
                                <div className={isAuth ? "w-full" : "flex-1 min-w-[200px]"}>
                                    <label htmlFor={item.name} className='text-sm font-medium text-slate-700 mb-1.5 block'>
                                        {item.label}
                                    </label>
                                    <input 
                                        type={item.type || 'text'} 
                                        placeholder={item.placeholder || ''} 
                                        name={item.name} 
                                        id={item.name}
                                        value={formValues[item.name] || ''}
                                        className='w-full h-11 block outline-none border border-slate-300 focus:border-[#3A5B22] focus:ring-1 focus:ring-[#3A5B22] rounded-xl px-4 text-sm bg-white transition-all'
                                        onChange={handleChange}  
                                    />
                                </div>
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
                            className={'text-center text-xs text-slate-600'}
                        />
                    </div>
                )}
            </form>
        </div>
    );
}

export default Form;