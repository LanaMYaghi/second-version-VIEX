import { Fragment } from "react";

const CustomTable = ({
  headers = [],
  data = [],
  expandedRowId = null,
  renderExpanded = null,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-4">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <Fragment key={row.id ?? rowIndex}>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    {headers.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 font-medium text-slate-700"
                      >
                        {header.type === "actions" ? (
                          <div className="flex items-center gap-3">
                            {(typeof header.buttons === "function"
                              ? header.buttons(row)
                              : header.buttons
                            ).map((btn, btnIndex) => (
                              <button
                                key={btnIndex}
                                onClick={() => btn.onClick(row)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${btn.className}`}
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        ) : header.key === "id" || header.key === "counter" ? (
                          /* التعديل هنا: إذا كان الـ key هو id أو counter، اعرض رقم الـ row التسلسلي بداً من الـ id الحقيقي */
                          rowIndex + 1
                        ) : (
                          /* الحالات العادية الأخرى */
                          row[header.key]
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* الصف الموسّع (اختياري) */}
                  {renderExpanded && expandedRowId === row.id && (
                    <tr className="bg-slate-50/60">
                      <td
                        colSpan={headers.length}
                        className="px-6 py-5 text-left font-normal"
                      >
                        {renderExpanded(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;