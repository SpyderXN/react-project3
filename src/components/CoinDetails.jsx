import {
  Badge,
  Box,
  Button,
  Container,
  Image,
  Progress,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import Loader from "./Loader";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../index";
import ErrorComponent from "./ErrorComponent";
import { HStack } from "@chakra-ui/react";
import { RadioGroup, Radio } from "@chakra-ui/react";
import Chart from "./Chart";

const CoinDetails = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);

  const params = useParams();

  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "365d", "max"];

  const switchChatsStats = (key) => {
    switch (key) {
      case "24h":
        setDays("24h");
        setLoading(true);
        break;

      case "7d":
        setDays("7d");
        setLoading(true);
        break;

      case "14d":
        setDays("14d");
        setLoading(true);
        break;

      case "30d":
        setDays("30d");
        setLoading(true);
        break;

      case "60d":
        setDays("60d");
        setLoading(true);
        break;

      case "200d":
        setDays("200d");
        setLoading(true);
        break;

      case "365d":
        setDays("365d");
        setLoading(true);
        break;

      case "max":
        setDays("max");
        setLoading(true);
        break;

      default:
        setDays("24h");
        setLoading(true);
        break;
    }
  };

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`);
        const { data: chartData } = await axios.get(
          `${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`
        );
        setChartArray(chartData.prices);
        setCoins(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchCoin();
  }, [params.id, currency, days]);

  if (error) {
    return <ErrorComponent message={"Error fetching data"} />;
  }

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box w={"full"} borderWidth={1}>
            <Chart days={days} arr={chartArray} currency={currencySymbol} />
          </Box>

          <HStack p={"4"} overflowX={"auto"}>
            {btns.map((i) => (
              <Button key={i} onClick={() => switchChatsStats(i)}>
                {i}
              </Button>
            ))}
          </HStack>

          <RadioGroup p={"8"} value={currency} onChange={setCurrency}>
            <HStack spacing={"4"}>
              <Radio value="inr">₹</Radio>
              <Radio value="usd">$</Radio>
              <Radio value="eur">€</Radio>
            </HStack>
          </RadioGroup>

          <VStack spacing={"4"} p={"16"} alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf={"center"} opacity={"0.7"}>
              Last updated on{" "}
              {Date(coins.market_data.last_updated).split("G")[0]}
            </Text>

            <Image
              src={coins.image.large}
              w={"16"}
              h={"16"}
              objectFit={"contain"}
            />

            <Stat>
              <StatLabel>{coins.name}</StatLabel>
              <StatNumber>
                {currencySymbol}
                {coins.market_data.current_price[currency]}
              </StatNumber>

              <StatHelpText>
                <StatArrow
                  type={
                    coins.market_data.price_change_percentage_24h > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coins.market_data.price_change_percentage_24h}%
              </StatHelpText>
            </Stat>

            <Badge fontSize={"2xl"} bgColor={"blackAlpha.900"} color={"white"}>
              {`#${coins.market_cap_rank}`}
            </Badge>

            <CustomBar
              high={`${currencySymbol}${coins.market_data.high_24h[currency]}`}
              low={`${currencySymbol}${coins.market_data.low_24h[currency]}`}
            />

            <Box w={"full"} p={"4"}>
              <Item title={"Max Supply"} value={coins.market_data.max_supply} />
              <Item
                title={"Circulating Supply"}
                value={coins.market_data.circulating_supply}
              />

              <Item
                title={"Market Cap"}
                value={`${currencySymbol} ${coins.market_data.market_cap[currency]}`}
              />

              <Item
                title={"All time low"}
                value={`${currencySymbol} ${coins.market_data.atl[currency]}`}
              />

              <Item
                title={"All time high"}
                value={`${currencySymbol} ${coins.market_data.ath[currency]}`}
              />
            </Box>
          </VStack>
        </>
      )}
    </Container>
  );
};

const Item = ({ title, value }) => (
  <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
    <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>
      {title}
    </Text>
    <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>
      {value}
    </Text>
  </HStack>
);

const CustomBar = ({ high, low }) => (
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>24H range</Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>
);

export default CoinDetails;
