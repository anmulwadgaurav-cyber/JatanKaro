import React from "react";
import Navbar from "../components/Navbar";
import CardContainer from "../components/CardContainer";
import DetailedCard from "../components/DetailedCard";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const params = useParams();
  const itemId = params.id;
  return (
    <main className="bg-background w-full h-full text-text">
      <DetailedCard itemId={itemId} />
      <Navbar />
      <div className=" flex flex-col items-center">
        <CardContainer />
      </div>
    </main>
  );
};

export default Dashboard;
