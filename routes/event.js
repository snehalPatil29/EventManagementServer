const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Events, validateEvent } = require("../models/event");
const { Sessions } = require("../models/session");

router.get("/", async (req, res) => {
  try {
    const events = await Events.find().sort("eventName");
    res.send(events);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", async (req, res) => {
  var event = new Events(
    _.pick(req.body, [
      "eventName",
      "venue",
      "description",
      "startDate",
      "endDate"
    ])
  );
  try {
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    event = await event.save();
    res.send(event);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const event = await Events.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "eventName",
        "venue",
        "description",
        "startDate",
        "endDate"
      ]),
      { new: true }
    );
    if (!event)
      return res.status(404).send("The Event with the given ID was not found.");
    res.send(event);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event)
      return res.status(404).send("The Event with the given ID was not found.");
    res.send(event);
  } catch (error) {
    res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const event = await Events.findByIdAndRemove(req.params.id);
    //await Events.find().where('event').equals(req.params.id).remove();
    if (!event)
      return res.status(404).send("The Event with the given ID was not found.");
    await Sessions.deleteMany({ event: req.params.id });
    //delete from following collections
    // rooms , aboutUS , attendance , attendee, helpDesk , location , questionForms ,
    // registrationResponse , speakers ,sponsors , profiles

    res.send(event);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
