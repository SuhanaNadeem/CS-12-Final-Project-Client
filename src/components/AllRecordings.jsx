import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TextInput,
} from "react-native";
import { UserAuthContext } from "../context/userAuth";
import { userClient } from "../../GraphqlApolloClients";
import RecordingPlayback from "./RecordingPlayback"

const AllRecordings = ({ userId }) => {

    const { data: { getS3RecordingUrls: s3RecordingUrls } = {} } =
        useQuery(GET_S3_RECORDING_URLS, {
        variables: { userId },
        client: userClient,
    });

    return (
        <View>
            <Text>
                Recording URLs:
                {/* {s3RecordingUrls && s3RecordingUrls} */}
            </Text>
            {s3RecordingUrls && s3RecordingUrls.map((s3RecordingUrl, index) => <RecordingPlayback key={index} s3RecordingUrl={s3RecordingUrl} />)}
        </View>
    );
};

export const GET_S3_RECORDING_URLS = gql`
  query getS3RecordingUrls($userId: String!) {
    getS3RecordingUrls(userId: $userId)
  }
`;

export default AllRecordings;
