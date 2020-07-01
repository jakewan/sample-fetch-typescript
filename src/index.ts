import { Fetcher } from './lib/fetcher'
import { User } from './lib/user'

const main = async () => {
    const testUrl = 'https://jsonplaceholder.typicode.com/todos/1'
    const fetcher = new Fetcher()
    await fetcher.doFetch(testUrl, [['foo', 'bar'], ['foo', 'baz']])
        .then(r => r.json())
        .then(j => {
            const user = new User(j.userId, j.id, j.title)
            console.log(user.str())
        })
        .catch(e => {
            console.error(e)
        })
}

export { main }
