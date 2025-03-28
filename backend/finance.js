const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
     date:{type:Date,required:true},
     monthlyIncome:{type:Number,required:true},
     moneySpent:{type:Number,required:true},
     activityName:{type:String,required:true},
     categoryName:{type:String,required:true} 
});

module.exports = mongoose.model("Finance",financeSchema);