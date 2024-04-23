import React from "react";
import { useRouter } from "next/router";
import Pagination from "react-bootstrap/Pagination";

type TPaginationProps = {
  total: number;
  page: number;
  limit: number;
};

export type TQueryProps = {
  page?: string;
  limit?: string;
};

const PaginationComponent = ({ total, page, limit }: TPaginationProps) => {
  const buttonsLength = 10;
  const lastPage = Math.ceil(total / limit);
  const minButtonPage =
    lastPage % buttonsLength === 0 || lastPage - page >= buttonsLength
      ? Math.floor((page % buttonsLength !== 0 ? page : page - 1) / buttonsLength) * buttonsLength + 1
      : lastPage - buttonsLength + 1;
  const buttonsArr: number[] = new Array(buttonsLength)
    .fill(minButtonPage)
    .map((el, ind) => el + ind)
    .filter((el) => el > 0);

  const router = useRouter();

  const handleClickNumber = (num: number) => {
    const query: TQueryProps = { page: num.toString() };
    if (limit !== 20) query.limit = limit.toString();

    router.push({
      pathname: "/",
      query,
    });
  };

  const handleChangeLimit = (limit: string) => {
    router.push({
      pathname: "/",
      query: { limit },
    });
  };

  return (
    <>
      <Pagination>
        <Pagination.First disabled={page === 1} onClick={() => handleClickNumber(1)} />
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => {
            if (page - 1) handleClickNumber(page - 1);
          }}
        />
        {buttonsArr.map((num) => (
          <Pagination.Item key={num} active={num === page} onClick={() => handleClickNumber(num)}>
            {num}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={page === lastPage}
          onClick={() => {
            if (page + 1 <= lastPage) handleClickNumber(page + 1);
          }}
        />
        <Pagination.Last disabled={page === lastPage} onClick={() => handleClickNumber(lastPage)} />
      </Pagination>
      <label htmlFor="limit">
        Изменить лимит на странице:
        <input
          type="number"
          min={1}
          max={total}
          id="limit"
          onBlur={(e) => handleChangeLimit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target instanceof HTMLInputElement) handleChangeLimit(e.target.value);
          }}
        />
      </label>
    </>
  );
};

export default PaginationComponent;
