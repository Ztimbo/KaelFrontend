import { useEffect, useState } from "react"
import axiosClient from "../../config/axosClient"
import getOptions from "../../helpers/getRequestOptions";
import GenericTable  from "../general/GenericTable";
import { headers } from "../../constants/usersTableHeaders";
import { getDate } from "../../helpers/getFormattedDate";
import './Users.scss';
import useAuth from "../../hooks/useAuth";
import GenericAlert from "../general/GenericAlert";
import { types } from "../../constants/alertType";

const Users = () => {
    const [tableHeaders, setTableHeaders] = useState([]);
    const [tableData, setTableData] = useState({});
    const [alert, setAlert] = useState({});

    const { setLoading } = useAuth();

    useEffect(() => {
        const getUsers = async() => {
            try {
                setLoading(true);
                const {data} = await axiosClient.get('/users', getOptions());

                data.map(d => {
                    d.createdAt = getDate(d.createdAt);
                    d.updatedAt = getDate(d.updatedAt);
                });

                setAlert({});
                setTableData(data);
                setTableHeaders(Object.keys(data[0]));
            } catch(err) {
                setAlert({msg: err.message, type: types.ERROR});
            } finally {
                setLoading(false);
            }
        }
        
        getUsers();
    }, []);

    const {msg} = alert;

  return (
    <div className="content-table">
        <h2>Usuarios</h2>
        <GenericTable tableHeaders={tableHeaders} tableHeadersAliases={headers} tableData={tableData} />
        {msg && <GenericAlert alert={alert} />}
    </div>
  )
}

export default Users