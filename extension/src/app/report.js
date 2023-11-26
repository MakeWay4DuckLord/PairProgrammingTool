import axios from 'axios';

var Report = () => {
    this.lines_of_code = 0,
    this.partner_lines_of_code = 0,
    this.interruptions = 0;
}

var FinalReport = new Report();

export const getInterruptions = (userId, partnerId) => {
    axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/utterances/interruptions/${userId}/${partnerId}`).then((body) => {
        FinalReport.interruptions = body.data;
    }, () => {
        //
    })
}

export const getLinesOfCode = (userId) => {
    axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/users/${userId}`).then((body) => {
        FinalReport.lines_of_code = body.data.lines_of_code;
    }, () => {
        //
    })
}

export const getPartnerLinesOfCode = (partnerId) => {
    axios.get(`${process.env.REACT_APP_WEBPAGE_URL}/server/api/users/${partnerId}`).then((body) => {
        FinalReport.partner_lines_of_code = body.data.lines_of_code;
    }, () => {
        //
    })
}