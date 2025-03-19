import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import PocketBase from "pocketbase";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pb = new PocketBase(process.env.POCKETBASE_URL);

pb.autoCancellation(false);

app.get("/", (req, res) => {
  res.send("server running");
});

app.get("/getPolicies", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return
  }

  await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);

  const data = await pb.collection("policies").getFullList();
  res.json(data);
});

app.get("/getApps", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return
  }

  await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);

  const data = await pb.collection("app").getFullList();
  res.json(data);
});

app.get("/getGroups", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return
  }

  await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
  const data = await pb.collection("group").getFullList();
  res.json(data);
});

app.get("/getUsers", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return
  }

  await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
  const data = await pb.collection("users").getFullList();
  res.json(data);
});

app.post("/createPolicy", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return
  }

  await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
  
  const policy = req.body;
  policy.visibility = policy.visibility.join(', ');
  policy.reviewers = policy.reviewers.join(', ');
  policy.accessibility = policy.accessibility.join(', ');
  console.log(policy);
  const data = await pb.collection("policies").create(policy);
  res.json({ message: "Policy created successfully", data });
});

app.post("/removePolicy", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return
  }

  await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword); 
  const policyId = req.body.policyId;
  const data = await pb.collection("policies").delete(policyId);
  res.json({ message: "Policy removed successfully", data });
});

app.get("/getOnePolicy/:policyId", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return
  }

  await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
  const policyId = req.params.policyId;
  const data = await pb.collection("policies").getOne(policyId);
  res.json(data);
});

app.post("/updatePolicy", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return
  }

  await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
  const policyId = req.body.policyId;
  const data = await pb.collection("policies").update(policyId, req.body.data);
  res.json({ message: "Policy updated successfully", data });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});