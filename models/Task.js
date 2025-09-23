// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String },
//     status: { 
//       type: String, 
//       enum: ["pending", "in-progress", "completed"], 
//       default: "pending" 
//     },
//     dueDate: { type: Date },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     createdAt: { type: Date, default: Date.now }
//   },
//   { collection: "tasks" }
// );

// module.exports = mongoose.model("Task", taskSchema, "taskDB");

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { 
      type: String, 
      enum: ["pending", "in-progress", "completed"], 
      default: "pending" 
    },
    dueDate: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },

    // 🔹 NEW: collaborators field
    collaborators: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { 
          type: String, 
          enum: ["viewer", "editor"], 
          default: "viewer" 
        }
      }
    ]
  },
  // { collection: "tasks" }
);

module.exports = mongoose.model("Task", taskSchema, "taskDB");
