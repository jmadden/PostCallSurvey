exports.handler = async (context, event, callback) => {
  let digits = parseInt(event.digits);
  let callStatus = event.callStatus;

  let client = context.getTwilioClient();

  let taskFilter = `callSurveyFor == '${event.phone}'`;

  //search for the task based on the CallSid attribute
  const tasks = await client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks.list({ evaluateTaskAttributes: taskFilter });
  console.log(tasks);
  let taskSid = tasks[0].sid;
  let attributes = { ...JSON.parse(tasks[0].attributes) };
  attributes.conversations.conversation_measure_1 = digits;
  //was the call abandoned?
  if (callStatus == 'completed') {
    attributes.conversations.abandoned = 'Yes';
    attributes.conversations.abandoned_phase = 'Survey';
  } else {
    attributes.conversations.abandoned = 'No';
    attributes.conversations.abandoned_phase = null;
  }

  //update the task
  client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks(taskSid)
    .update({
      assignmentStatus: 'canceled',
      reason: 'IVR task',
      attributes: JSON.stringify(attributes),
    });
};
