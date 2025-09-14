import { Babonus } from "./babonus-model.mjs";
import BabonusModels from "./babonus-model.mjs";
import AuraModel from "./aura-model.mjs";
import ConsumptionModel from "./consumption-model.mjs";
import ModifiersModel from "./modifiers-model.mjs";

export default {
  Babonus,
  ...BabonusModels,
  AuraModel,
  ConsumptionModel,
  ModifiersModel
};