import { Schema, model, models } from "mongoose";

const SandboxSimulationSchema = new Schema({
  userId: {
    type: String, // from Better-Auth session
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  scenarioDate: {
    type: Date,
    required: true,
  },
  decision: {
    type: String,
    enum: ["BUY", "SELL"],
    required: true,
  },
  outcome: {
    type: String,
    enum: ["CORRECT", "INCORRECT"],
    required: true,
  },
  priceAtDecision: {
    type: Number,
    required: true,
  },
  priceAfter30Days: {
    type: Number,
    required: true,
  },
  aiAnalysis: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SandboxSimulation = models.SandboxSimulation || model("SandboxSimulation", SandboxSimulationSchema);

export default SandboxSimulation;
