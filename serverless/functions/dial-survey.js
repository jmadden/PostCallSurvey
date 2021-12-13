const TokenValidator = require('twilio-flex-token-validator').functionValidator;
let path = Runtime.getFunctions()['survey-utils'].path;
let assets = require(path);

exports.handler = TokenValidator(async (context, event, callback) => {
  const client = context.getTwilioClient();
  const { callSid, caller } = event;
  console.log('CONVERSATION ID: ', callSid);
  console.log('SURVEY ID: ', caller);

  // Connect customer to survey
  try {
    // Create survey tracking task
    const attributes = {
      callSurveyFor: caller,
      conversations: {
        conversation_id: callSid,
        virtual: 'Yes',
        abandoned: 'Yes',
        abandoned_phase: 'Survey',
      },
    };

    const surveyTask = await client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .tasks.create({
        attributes: JSON.stringify(attributes),
        workflowSid: context.TWILIO_NOBODY_WORKFLOW_SID,
        timeout: 300,
      });

    const response = await client.calls(event.callSid).update({
      twiml: `<Response><Dial><Number>${context.SURVEY_PHONE}</Number></Dial></Response>`,
    });

    if (response) {
      return callback(null, assets.response('json', response));
    }
  } catch (error) {
    return callback(`ERROR - Failed to conntect survey: ${error}`);
  }
});
