// "use client";

// import { useState } from "react";
// import { toast } from "sonner"; // or use alert() if not using Sonner

// export default function EventForm() {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     date: "",
//     time: "",
//     location: "",
//     capacity: "",
//     availableSeats: "",
//     category: "",
//     price: "",
//     image: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // ✅ Check required fields
//     const requiredFields = ["title", "description", "date", "time", "location", "category", "capacity", "price"];
//     for (const field of requiredFields) {
//       if (!form[field as keyof typeof form]) {
//         toast.error(`${field} is required`);
//         return;
//       }
//     }

//     // ✅ Convert to numbers and validate
//     const capacity = Number(form.capacity);
//     const availableSeats = Number(form.availableSeats || form.capacity);
//     const price = Number(form.price);

//     if (isNaN(price) || isNaN(capacity) || price < 0 || capacity < 1) {
//       toast.error("Capacity and price must be valid numbers");
//       return;
//     }

//     const eventData = {
//       ...form,
//       capacity,
//       availableSeats,
//       price,
//     };

//     // ✅ Send to backend
//     const res = await fetch("/api/events", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(eventData),
//     });

//     if (!res.ok) {
//       const { error } = await res.json();
//       toast.error(`Failed to create event: ${error}`);
//       return;
//     }

//     toast.success("Event created successfully!");
//     setForm({
//       title: "",
//       description: "",
//       date: "",
//       time: "",
//       location: "",
//       capacity: "",
//       availableSeats: "",
//       category: "",
//       price: "",
//       image: "",
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3 max-w-lg mx-auto p-4">
//       <input type="text" name="title" placeholder="Event Title" value={form.title} onChange={handleChange} className="border p-2 w-full" />
//       <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full" />
//       <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 w-full" />
//       <input type="time" name="time" value={form.time} onChange={handleChange} className="border p-2 w-full" />
//       <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border p-2 w-full" />
//       <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border p-2 w-full" />

//       <input type="number" name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} className="border p-2 w-full" min={1} />
//       <input type="number" name="availableSeats" placeholder="Available Seats (optional)" value={form.availableSeats} onChange={handleChange} className="border p-2 w-full" min={0} />
//       <input type="number" name="price" placeholder="Ticket Price (₦)" value={form.price} onChange={handleChange} className="border p-2 w-full" min={0} />

//       <input type="text" name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} className="border p-2 w-full" />

//       <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Create Event</button>
//     </form>
//   );
// }
