// components/EmailCard.js
export default function EmailCard({ subject, snippet, from, date, hasAttachment }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 h-full">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">{subject}</h3>
        {hasAttachment && (
          <svg className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        )}
      </div>
      {from && (
        <p className="text-sm text-gray-600 mb-2">From: {from}</p>
      )}
      {snippet && (
        <p className="text-gray-600 text-sm line-clamp-3">{snippet}</p>
      )}
      {date && (
        <p className="text-xs text-gray-500 mt-3">{new Date(date).toLocaleDateString()}</p>
      )}
    </div>
  );
}