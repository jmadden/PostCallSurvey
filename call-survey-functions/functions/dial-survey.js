const TokenValidator = require('twilio-flex-token-validator').functionValidator;
let path = Runtime.getFunctions()['survey-utils'].path;
let assets = require(path);

exports.handler = TokenValidator(async (context, event, callback) => {
  console.log('CALL SID: ', event.callSid);
  const client = context.getTwilioClient();

  try {
    const response = await client.calls(event.callSid).update({
      twiml: `<Response><Leave /><Dial><Number>${context.SURVEY_PHONE}</Number></Dial></Response>`,
    });

    if (response) {
      return callback(null, assets.response());
    }
  } catch (error) {
    return callback(`ERROR - Failed to conntect survey: ${error}`);
  }
});
