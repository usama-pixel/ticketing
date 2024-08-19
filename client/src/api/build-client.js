import axios from "axios";

export const buildClient = ({ headers, server=true}) => {
    if (server) {
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            // http://SERVICE_NAME.NAMESPACE.svc.cluster.local
            // you can get SERVICE_NAME by running the command 
            // kubectl get service -n ingress-nginx
            // you can get NAMESPACE by running the command 
            // kubectl get namespace
            headers
        })
    }

    return axios.create({ baseURL: '/' })
}