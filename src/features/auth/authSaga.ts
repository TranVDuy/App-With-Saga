import { delay, fork, take, call, put } from "redux-saga/effects";
import { LoginPayLoad, authAction } from "./authSlice";
import { PayloadAction } from "@reduxjs/toolkit";

function* handleLogin(payload: LoginPayLoad) {
    try {
        yield delay(1000);
        localStorage.setItem("access_token", `${payload.userName}_${payload.password}`);
        yield put(authAction.loginSuccess({
            id: 1,
            name: payload.userName
        }))
    } catch (error) {
        yield put(authAction.loginFailed("Login Faild"));
    }
};

function* handleLogout() {
    yield delay(1000);
    localStorage.removeItem('access_token');
};

function* watchLoginFlow() {
    while (true) {
        const isLoggedIn = Boolean(localStorage.getItem('access_token'));
        if(!isLoggedIn) {
            const action: PayloadAction<LoginPayLoad> = yield take(authAction.login.type);
            yield fork(handleLogin, action.payload);
        }
        yield take(authAction.logout.type);
        yield call(handleLogout); 
    }
};

export function* authSaga() {
    yield fork(watchLoginFlow);
};