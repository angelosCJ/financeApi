const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Finance = require("./finance");

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

mongoose.connect("mongodb+srv://kadurienzo:ballsdeep%402025@mern.zylr0.mongodb.net/Sales?retryWrites=true&w=majority&appName=MERN").
then(()=> console.log("Connected to MongoDB")).
catch((error)=> console.log("Unable to connect to the Database",error));

const PORT = 8800;

app.listen(PORT,()=>{
  console.log("Succssesfuly connected to the server with port 8800");
});

app.post("/send",async(req,res)=>{
   const {  date, monthlyIncome, moneySpent, activityName, categoryName} = req.body;

   if (!date || !monthlyIncome || !moneySpent || !activityName || !categoryName) {
    console.log("Request failed:", {date, monthlyIncome, moneySpent, activityName, categoryName});
    return res.status(400).json({ message: "All fields are required." });
   }
  
   try {
     const COLLECTED_DATA = new Finance({
        date:new Date(date),
        monthlyIncome:parseFloat( monthlyIncome),
        moneySpent:parseFloat( moneySpent),
        activityName,
        categoryName
     });
     await COLLECTED_DATA.save();
     res.status(200).json({message:"Succsessfuly sent collected data"});
   } catch (error) {
    res.status(500).json({message:"Unable to send collected data"});
   }

});

app.get("/getData",async(req,res)=>{
   try {
    const RETRIEVED_DATA = await Finance.find({});
    res.json(RETRIEVED_DATA);
   } catch (error) {
    res.status(500).json({message:"Unable to find collected data"});
   }
});

app.delete("/deleteData/:id",async(req,res)=>{
  try {
    const id = req.params.id;
    await Finance.findByIdAndDelete(id);
    res.status(200).json({message:"Deleted data succssesfuly"});
  } catch (error) {
    res.status(500).json({message:"Unable to delete data"});
  }
});

// GET sum of moneySpent
app.get("/data/sum", async (req, res) => {
    try {
        const SUM_OF_MONEYSPENT = await Finance.aggregate([
            {
                $group: {
                    _id: null,
                    totalMoneySpent: { $sum: "$moneySpent" },
                }
            }
        ]);

        const moneySpent = SUM_OF_MONEYSPENT.length > 0 ? SUM_OF_MONEYSPENT[0].totalMoneySpent : 0;
        res.status(200).json({ totalMoneySpent: moneySpent });
    } catch (error) {
        console.error("Error retrieving sum:", error);
        res.status(500).json({ message: "Error, unable to get sum of all data" });
    }
  });

  // Get latest Monthly Income
  app.get("/latestMonthlyIncome", async (req, res) => {
  try {
    const latestMonthlyIncome = await Finance.aggregate([
      { $sort: { _id: -1 } }, // Sort by the most recent entry
      { $limit: 1 }, // Take only the latest one
      { $project: { _id: 0, monthlyIncome: 1 } } // Return only the required field
    ]);

    if (latestMonthlyIncome.length === 0) {
      return res.status(404).json({ error: "No Monthly Income data found" });
    }

    res.status(200).json(latestMonthlyIncome[0]); // Return a single object, not an array
  } catch (error) {
    console.error("Error fetching Income status:", error);
    res.status(500).json({ error: "Unable to retrieve Income data" });
  }
});


