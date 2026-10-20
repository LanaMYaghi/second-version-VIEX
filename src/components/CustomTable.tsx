

const CustomTable = ({ headers = [], data = [],onAction }) => {
  
 return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm text-slate-600">
          
          {/* الهيدر */}
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-4">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* البودي */}
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-8 text-center text-slate-400">
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50/80 transition-colors">
                  {headers.map((header, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 font-medium text-slate-700">
                      
                      {/* إذا كان العمود مخصص للأزرار (Actions) */}
                      {header.type === 'actions' ? (
                        <div className="flex items-center gap-3">
                          {header.buttons.map((btn, btnIndex) => (
                            <button
                              key={btnIndex}
                              onClick={() => btn.onClick(row)} // بنمرر الـ row كامل للزر لحتى نعرف أي سطر انكبس
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${btn.className}`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* العرض العادي للبيانات */
                        row[header.key]
                      )}

                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default CustomTable