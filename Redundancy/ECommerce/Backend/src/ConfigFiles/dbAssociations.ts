import User from "../models/Order";
import Event from "../models/Products";

User.hasMany(Event, { foreignKey: "author" });
Event.belongsTo(User, { foreignKey: "author" });

export { User, Event };
