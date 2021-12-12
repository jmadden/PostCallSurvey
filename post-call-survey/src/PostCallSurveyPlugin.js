import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import { dialNumber } from './utils';

const PLUGIN_NAME = 'PostCallSurveyPlugin';

export default class PostCallSurveyPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    flex.Actions.addListener(
      'beforeHangupCall',
      async (payload, abortFunction) => {
        const { survey } = payload.task.attributes;

        console.debug('SURVEY: ', survey);
        if (survey == 'true') {
          console.log('SURVEY IS TRUE');
          const participantArray = payload.task.conference.participants.find(
            (results) => results.participantType === 'customer'
          );
          const customerCallSid = participantArray.callSid;
          console.debug('CUSTOMER CALL SID:', customerCallSid);

          const dialSurvey = async (callSid) => {
            try {
              const response = await dialNumber(callSid);
              console.debug('DIAL SURVEY RESPONSE: ', response);
              return response;
            } catch (e) {
              console.debug('ERROR DIALING SURVEY NUMBER');
              console.error(e);
            }
          };

          await dialSurvey(customerCallSid);
        }
      }
    );
  }
}
