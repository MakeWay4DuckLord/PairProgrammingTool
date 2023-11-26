import axios from 'axios';

var Report = () => {

}

export const getInterruptions = (userId, partnerId) => {
    axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/utterances/interruptions/${userId}/${partnerId}`).then((body) => {
        return body.data;
    }, () => {
        return 0;
    })
}

export const getLinesOfCode = (userId) => {
    axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/users/${userId}`).then((body) => {
        return body.data.lines_of_code;
    }, () => {
        return 0;
    })
}

export const getPartnerLinesOfCode = (partnerId) => {
    axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/users/${partnerId}`).then((body) => {
        return body.data.lines_of_code;
    }, () => {
        return 0;
    })
}