import { Manager } from '@twilio/flex-ui';
import axios from 'axios';

const manager = Manager.getInstance();
const { FLEX_APP_SERVICE_BASE_URL } = process.env;

console.debug('REQUEST BASE URL: ', FLEX_APP_SERVICE_BASE_URL);

export const dialNumber = async (callSid) => {
  const resp = await axios({
    method: 'post',
    url: `${FLEX_APP_SERVICE_BASE_URL}/dial-survey`,
    data: {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      callSid,
    },
  });

  return await resp;
};
