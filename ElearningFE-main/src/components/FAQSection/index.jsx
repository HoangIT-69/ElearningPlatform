export default function FAQSection() {
  const faqs = [
    {
      q: "Khóa học có phù hợp cho người mới không?",
      a: "Có. Nội dung được thiết kế từ cơ bản đến nâng cao.",
    },
    {
      q: "Nếu bận thì có xem lại bài không?",
      a: "Bạn có thể xem lại bài học bất cứ lúc nào trong thời gian truy cập còn hiệu lực.",
    },
    {
      q: "Có hỗ trợ xin việc không?",
      a: "Chúng tôi hỗ trợ xây CV và định hướng nghề nghiệp.",
    },
  ];

  return (
    <div className="py-20 bg-white border-b border-red-200">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl text-red-500 md:text-4xl font-bold text-foreground text-center mb-10">
          Câu hỏi thường gặp
        </h2>

        <div className="space-y-6">
          {faqs.map((item, index) => (
            <details
              key={index}
              className="bg-white p-6 rounded-lg shadow border border-red-200"
            >
              <summary className="cursor-pointer font-semibold text-lg">
                {item.q}
              </summary>
              <p className="text-gray-600 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
