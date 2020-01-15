import TripitakaServer from './TripitakaServer';

const PORT = process.env.PORT || '5000';

const tripitakaServer = new TripitakaServer();
// tslint:disable-next-line: radix
tripitakaServer.start( parseInt( PORT));
