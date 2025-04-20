
// import React from 'react';
// import { Star } from 'lucide-react';

// const testimonials = [
//   {
//     name: "Sarah Johnson",
//     position: "Marketing Director, TechFirm Inc.",
//     image: "https://randomuser.me/api/portraits/women/1.jpg",
//     quote: "CatchCRM transformed how we manage our customer relationships. The intuitive interface and powerful automation features have saved us countless hours every week."
//   },
//   {
//     name: "Michael Chen",
//     position: "Sales Manager, GrowthCo",
//     image: "https://randomuser.me/api/portraits/men/2.jpg",
//     quote: "We've tried several CRM solutions, but none matched the flexibility and ease of use of CatchCRM. Our sales team adoption has never been higher."
//   },
//   {
//     name: "Emily Rodriguez",
//     position: "Customer Success Lead, SaaS Platform",
//     image: "https://randomuser.me/api/portraits/women/3.jpg",
//     quote: "The analytics and reporting capabilities have given us insights we never had before. We're now able to proactively address customer needs before they reach out."
//   }
// ];

// const Reviews = () => {
//   return (
//     <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 className="section-title">Trusted by Industry Leaders</h2>
//           <p className="section-subtitle">
//             Don't just take our word for it — hear what our customers have to say.
//           </p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
//               <div className="flex items-center space-x-1 mb-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
//                 ))}
//               </div>
//               <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
//               <div className="flex items-center">
//                 <img 
//                   src={testimonial.image} 
//                   alt={testimonial.name} 
//                   className="w-12 h-12 rounded-full mr-4"
//                 />
//                 <div>
//                   <h4 className="font-semibold">{testimonial.name}</h4>
//                   <p className="text-sm text-gray-600">{testimonial.position}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Reviews;