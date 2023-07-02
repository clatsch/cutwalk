import { mockRequest, mockResponse } from 'jest-mock-req-res';

jest.mock('../../models/userModel.js');
jest.mock('../../utils/appError.js');
jest.mock('../../utils/catchAsync.js');

describe('User Controller', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
