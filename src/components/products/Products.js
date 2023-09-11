import { useEffect, useState } from "react"
import axiosClient from "../../config/axosClient"
import getOptions from "../../helpers/getRequestOptions";
import GenericTable  from "../general/GenericTable";
import { headers } from "../../constants/productsTableHeaders";
import { getDate } from "../../helpers/getFormattedDate";
import useAuth from "../../hooks/useAuth";
import GenericAlert from "../general/GenericAlert";
import { types } from "../../constants/alertType";
import { Link } from "react-router-dom";

const Products = () => {
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState({});
  const [alert, setAlert] = useState({});

  const { setLoading } = useAuth();

  useEffect(() => {
      const getProducts = async() => {
          try {
              setLoading(true);
              const {data} = await axiosClient.get('/products', getOptions());
              
              if(data.length > 0) {
                data.map(d => {
                    d.createdAt = getDate(d.createdAt);
                    d.updatedAt = getDate(d.updatedAt);
                    d.price = `$${d.price}`;
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
      
      getProducts();
  }, []);

  const {msg} = alert;

  return (
    <div className="content-table">
        <h2>Productos</h2>
        {
          tableData.length > 0 ? (
            <GenericTable tableHeaders={tableHeaders} tableHeadersAliases={headers} tableData={tableData} />
          ) : <label>No existen productos, puedes empezar añadiendo uno <Link to='new'>aqui</Link></label>
        }
        {msg && <GenericAlert alert={alert} />}
    </div>
  )
}

export default Products