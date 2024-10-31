const sendMailMock = jest.fn();

const createTransportMock = {
  sendMail: sendMailMock,
};

const nodemailer = {
  createTransport: jest.fn().mockReturnValue(createTransportMock),
};

export default nodemailer;
export { sendMailMock };
