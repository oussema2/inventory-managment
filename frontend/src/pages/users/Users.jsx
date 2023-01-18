import axios from "axios";
import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { AiOutlineEye } from "react-icons/ai";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SpinnerImg } from "../../components/loader/Loader";
import Search from "../../components/search/Search";
import { selectFilteredPoducts } from "../../redux/features/product/filterSlice";
import { deleteProduct } from "../../redux/features/product/productSlice";
import "../../components/product/productList/productList.scss";

const Users = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const isLoading = false;
  const filteredProducts = useSelector(selectFilteredPoducts);
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "http://localhost:5000/api/users/getUsers"
      );
      if (response.data) {
        setUsers(response.data.data);
      }
    })();
  }, []);

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 5) % filteredProducts.length;
    setItemOffset(newOffset);
  };
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => deleteProduct(id),
        },
        {
          label: "Cancel",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  return (
    <div className="product-list">
      {" "}
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Users List</h3>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && users.length === 0 ? (
            <p>-- No product found, please add a product...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>bio</th>
                </tr>
              </thead>

              <tbody>
                {users.map((product, index) => {
                  const { _id, name, email, phone, bio, role } = product;
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>{email}</td>
                      <td>{role}</td>
                      <td> {phone}</td>
                      <td>{bio}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </div>
  );
};

export default Users;
