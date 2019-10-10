/**
 * Created by JK
 * date: 2018-10-19
 */

export interface UserVO extends Express.Session
{
    user: {
        id: string;
        password : string;
        name: string;
        authorized: boolean;
    }
}