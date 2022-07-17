import type { NextApiRequest, NextApiResponse } from "next";

export const getUser = async () => {
    console.log('get user')
    return {hi:'hi'}
};

