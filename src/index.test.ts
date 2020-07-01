import { main } from './index'

type TestConfig = {
    description: string,
}

type TestConfigWithUser = TestConfig & {
    userData: {
        userId: number,
        id: number,
        title?: string,
        completed: boolean,
    },
    expectedOutput: string
}

type TestConfigWithException = TestConfig & {
    exceptionText: string
}

function isConfigWithUser(config: any): config is TestConfigWithUser {
    return typeof config.expectedOutput === 'string'
}

function isConfigWithException(config: any): config is TestConfigWithException {
    return typeof config.exceptionText === 'string'
}

describe('main', () => {
    let log: jest.SpyInstance
    let logError: jest.SpyInstance
    const testConfigs: (TestConfigWithUser | TestConfigWithException)[] = [
        {
            description: 'Writes expected output for user',
            userData: {
                userId: 1,
                id: 2,
                title: "delectus aut autem",
                completed: false
            },
            expectedOutput: 'User (id: 2, userId: 1, title: delectus aut autem)',
        }, {
            description: 'Writes expected error output',
            exceptionText: 'foo',
        }, {
            description: 'Writes expected output for user without title',
            userData: {
                userId: 1,
                id: 2,
                completed: false
            },
            expectedOutput: 'User (id: 2, userId: 1)',
        }
    ]
    beforeEach(() => {
        fetchMock.resetMocks()
        log = jest.spyOn(console, 'log').mockImplementation()
        logError = jest.spyOn(console, 'error').mockImplementation()
    })
    afterEach(() => {
        log.mockRestore()
        logError.mockRestore()
    })
    testConfigs.forEach(config => {
        test(config.description, async () => {
            const log = jest.spyOn(console, 'log')
            const logError = jest.spyOn(console, 'error')
            if (isConfigWithUser(config)) {
                fetchMock.mockResponse(JSON.stringify(config.userData))
            } else if (isConfigWithException(config)) {
                fetchMock.mockRejectOnce(new Error(config.exceptionText))
            }
            // Code under test
            await main()
            // Verify
            expect(fetchMock.mock.calls.length).toEqual(1)
            if (isConfigWithUser(config)) {
                expect(log).toHaveBeenCalledWith(config.expectedOutput)
            } else if (isConfigWithException(config)) {
                expect(logError).toHaveBeenCalledWith(new Error(config.exceptionText))
            }
        })
    })
})
