import { FC, useEffect, useState } from "react"
import Toast from "./Toast";
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


// const citydata = [
//   {
//     "_id": "672dc81b669d5c1a2f93fe67",
//     "city": "New York City",
//     "state": "New York",
//     "latitude": 34.0522,
//     "longitude": -118.2437,
//     "__v": 0
//   },
//   {
//     "_id": "67344536e776b0d37c8b568a",
//     "city": "Los Angeles",
//     "state": "California",
//     "latitude": 34.0522,
//     "longitude": -118.2437,
//     "__v": 0
//   },
//   {
//     "_id": "67344e01dc76b9496967494f",
//     "city": "New York City",
//     "state": "New York ",
//     "latitude": 40.6590529,
//     "longitude": 40.6590529,
//     "__v": 0
//   }
// ]

interface FavoriteItem {
  _id: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  __v: number;
}

interface dataT {
  city: string
  state: string
  street: string
};

interface FavProps {
  onFavClick: (data: dataT) => void
}

const Favorites: FC<FavProps> = ({ onFavClick }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const fetchFavorites = async () => {
    try {

      const response = await axios.get('https://webtechassign3-441822.uw.r.appspot.com/get_favorites');
      // const data: City[] = await response.json();
      const favoritedItems = response.data;

      if (favoritedItems.length === 0) {
        setShowToast(true);
      } else {
        setFavorites(favoritedItems);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  const handleDelete = async (id: string) => {
    console.log("in delete")
    try {
      await axios.delete(`https://webtechassign3-441822.uw.r.appspot.com/delete_favorite/${id}`);
      fetchFavorites();
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  const handleFavClick = (i: any) => {
    console.log("Raching here")
    console.log(favorites[i])
    const dataToBeSent: dataT = {
      city: favorites[i].city,
      state: favorites[i].state,
      street: ""
    }
    onFavClick(dataToBeSent)
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <>
      <div className="w-100">
        {showToast ? <Toast color="yellow" desc="Sorry!! No Records Found" /> :
          <div className="w-100">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">City </th>
                  <th scope="col">State</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((city, index) => (
                  <tr key={city._id}>
                    <th scope="row">{index + 1}</th>
                    <td onClick={() => handleFavClick(index)} className="text-decoration-underline text-primary">{city.city}</td>
                    <td onClick={() => handleFavClick(index)} className="text-decoration-underline text-primary">{city.state}</td>
                    <td>
                      <button type="button" className="btn" onClick={() => handleDelete(city._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  )
}

export default Favorites