process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import validateEnv from '@utils/validateEnv';
import PollRout from '@routes/poll.routes';

validateEnv();
const app = new App([new PollRout()]);

app.listen();
