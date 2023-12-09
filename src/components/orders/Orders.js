import { useEffect, useState } from "react"
import axiosClient from "../../config/axosClient"
import getOptions from "../../helpers/getRequestOptions";
import GenericTable  from "../general/GenericTable";
import { headers } from "../../constants/ordersTableHeaders";
import { getDate } from "../../helpers/getFormattedDate";
import useAuth from "../../hooks/useAuth";
import GenericAlert from "../general/GenericAlert";
import { types } from "../../constants/alertType";
import { Link } from "react-router-dom";

const Orders = () => {
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState({});
  const [alert, setAlert] = useState({});

  const { setLoading } = useAuth();

  useEffect(() => {
      const getOrders = async() => {
          try {
              setLoading(true);
              const {data} = await axiosClient.get('/orders', getOptions());
              
              if(data.length > 0) {
                data.map(d => {
                    d.deliverDate = getDate(d.deliverDate);
                });

                setAlert({});
                setTableData(data);
                setTableHeaders(Object.keys(data[0]));
              }
          } catch(err) {
              setAlert({msg: err.message, type: types.ERROR});
          } finally {
              setLoading(false);
          }
      }
      
      getOrders();
  }, []);

  const {msg} = alert;

  return (
    <div className="content-table">
        <h2>Ordenes</h2>
        {
          tableData.length > 0 ? (
            <GenericTable tableHeaders={tableHeaders} tableHeadersAliases={headers} tableData={tableData} isOrdersTable={true} />
          ) : <label>No existen ordenes, puedes empezar añadiendo una <Link to='new'>aqui</Link></label>
        }
        {msg && <GenericAlert alert={alert} />}
    </div>
  )
}

export default Orders