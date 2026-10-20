import React, { useState } from 'react'
import FormFooter from './FormFooter'

function Form({ linkTo, textLink, textFooter, inputData, onSubmit }) {
  const [formValues, setFormValues] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <div className='md:w-404 w-full'>
      <form onSubmit={handleSubmit} className='w-full'>
        {inputData.map((item, index) => (
          <div key={index} className="mb-4">
            
            {/* 1. الحالة العادية أو مجموعة حقول (Inputs Group) */}
            {item.inputs ? (
              item.inputs.map((input, i) => (
                <div key={i} className="mb-4">
                  <label htmlFor={input.name} className='text-lg mb-2 block'>{input.label}</label>
                  <input 
                    type={input.type} 
                    placeholder={input.placeholder} 
                    name={input.name} 
                    value={formValues[input.name] || ''}
                    className='w-full h-48 block outline-0 border border-[#5a5a5a] rounded-lg p-10'
                    onChange={handleChange}  
                  />
                </div>
              ))
            ) : item.type === "textarea" ? (
              
              /* 2. حالة حقل النصوص الطويلة (Textarea) */
              <div> 
                <label htmlFor={item.name} className='text-lg mb-2 block'>{item.label}</label>
                <textarea 
                  name={item.name} 
                  id={item.name} 
                  placeholder={item.placeholder} 
                  value={formValues[item.name] || ''}
                  onChange={handleChange}
                  className='w-full h-100 block outline-0 border border-[#5a5a5a] rounded-lg p-10'
                ></textarea>
              </div>

            ) : item.type === "submit" ? (
              
              /* 3. زر الإرسال (Submit Button) */
              <button
                type="submit" 
                name={item.name}
                className={`w-full h-50 block outline-0 rounded-lg p-10 my-4 text-center text-white font-semibold bg-[#3A5B22] ${item.className || ''}`}
              > 
                {item.text}
              </button>

            ) : null}

          </div>
        ))}

        {/* تذييلة الفورم تظهر فقط إن وجدت البيانات الخاصة بها */}
        {textFooter && (
          <FormFooter
            linkTo={linkTo}
            textFooter={textFooter}
            textLink={textLink}
            className={'text-center'}
          />
        )}
      </form>
    </div>
  )
}

export default Form