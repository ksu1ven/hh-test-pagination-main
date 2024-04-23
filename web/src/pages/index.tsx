/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import PaginationComponent, { TQueryProps } from "@/components/Pagination";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  data: { users: TUserItem[]; total: number; page: number; limit: number };
};

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const { page, limit } = ctx.query;
    const res = await fetch(
      `${
        process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://hh-test-pagination-main.vercel.app"
      }/users/${page ? `?page=${page}` : ""}${limit ? `${page ? "&" : "?"}limit=${limit}` : ""}`,
      { method: "GET" }
    );
    if (!res.ok) {
      return { props: { statusCode: res.status, data: await res.json() } };
    }

    return {
      props: { statusCode: 200, data: await res.json() },
    };
  } catch (e) {
    return { props: { statusCode: 500, data: { users: [], total: 0, page: 1, limit: 20 } } };
  }
}) satisfies GetServerSideProps<TGetServerSideProps>;

export default function Home({ statusCode, data }: TGetServerSideProps) {
  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const { users, total, page, limit } = data;
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const correctQuery: TQueryProps = {};
    if (page && page !== 1)
      correctQuery.page = page <= Math.ceil(total / limit) ? page.toString() : Math.ceil(total / limit).toString();
    if (limit && limit !== 20) correctQuery.limit = limit.toString();
    if (searchParams.get("page") != correctQuery.page || searchParams.get("limit") != correctQuery.limit)
      router.push({
        pathname: "/",
        query: correctQuery,
      });
  }, [page, limit, router, searchParams, total]);

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {page <= Math.ceil(total / limit) && <PaginationComponent total={total} page={page} limit={limit} />}
        </Container>
      </main>
    </>
  );
}
