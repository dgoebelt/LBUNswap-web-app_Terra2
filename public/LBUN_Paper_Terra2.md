![](RackMultipart20230114-1-8kdbjk_html_f5154f85eec8d102.png) 28 Sep 2022

# Accelerated LUNC Burning

via Community based Token Bonding Curve

Author: LBUN Team ([lbunproject@gmail.com](mailto:lbunproject@gmail.com))


## Introduction
Terra's UST and LUNA collapsed in the spring of 2022 resulting in devasting consequences for the digital currency space. It is estimated that a whooping $60 billion were wiped across various crypto projects.

Among the hardest hit was the community that supported Terra's ecosystem. Investors lost their entire funds within a few days' time. Terra LUNA's founders abandoned the project when they were unsuccessful in restoring the ecosystem. However, the community refused to give up hope and rallied together in a massive effort to restore the newly named LUNC.

Over the next few months, many teams have put in countless hours working towards planning, proposing solutions and starting the burning of the excess LUNC in circulation. During September, some exchanges started to burn LUNC based on the 1.2% proposal that was voted on by the community. However, there has been a realization that some exchanges will follow a different path by either not participating or burning a smaller amount. This results in the community being at the mercy of the exchanges as they have a larger "say" then the community.

This paper will present an alternate method of burning LUNC at an accelerated rate while being totally controlled by the will of the community members. This solution is realized by utilizing a token bonding curve (TBC) that will collect 2.4% tax on each buy/sell of the LUNC Burn Token (LBUN). The 2.4% tax will be used to buy LUNC on Terra Classic (or wrapped LUNC on other blockchains) for destruction by the burning mechanism. The end result is that twice the amount of LUNC is burned without relying on the cooperation of exchanges (or any centralized entity).

## Project Goals

The LBUN project has three simple goals:

1. Accelerate the burning of LUNC
2. Provide power to the LUNC community
3. Reward supports of the LBUN project (via Raffles)

## Methods and considerations

Several blockchains, DEXes, CEXes, and digital currencies were considered during the creation of this LUNC burn project. Ultimately, Solana, Bonding Curves and the Strata protocol were selected as the best components for our solution. The following explains the rationale:

### Why Solana?

Solana was created to solve the scaling challenges faced by the Ethereum blockchain. Solana uses clever technical tricks to find convincing solutions to problems that are not being solved by other blockchain platforms. Solana:

1. Uses well-known languages (C, C++, and Rust)
2. Handles \> 50,000 TPS
3. Utilizes a 400ms block time
4. Has extremely low transaction fees. (about 0.000005 SOL or $0.0000014 USD)

### Why a Bonding Curve?

Bonding Curves are cryptoeconomic mechanisms that enable coordination and fund raising by community participants to achieve a shared goal. In other words, token bonding curves incentivize players in an economic game towards an outcome that is mutually beneficial. In our case, the community participants are LUNC supporters and the shared goal is to burn enough LUNC as to elevate its price. The mutual benefit is that LUNC holders can recover at least some of their original investment.

Bonding Curves allow for:

1. Decentralized fund raising
2. Automatic price management
3. Instant Liquidity
4. Flexible configuration to fit almost any situation
5. Uncapped market so all community members can participate

### Why Strata Protocol?

Strata Protocol is an open-source protocol to launch tokens around a person, project, idea, or collective on Solana. Strata smart contracts are the perfect tools to create a community token to support fund raising in an effort to accelerate the amount of LUNC burned. The LUNC Burn Token (LBUN) will utilize the Strata Protocol to handle the complex functions required to manage a Token Bonding Curve. Strata enables this project to:

1. Utilize an open source and ready to implement solution
2. Leverage the deployed (audited) smart contracts
3. Collect royalties (buy/sell tax) to fund the LUNC burns
4. Enable Raffles as incentives to encourage community members to get involved
5. Concentrate on burning LUNC instead of focusing on complex math

## Token Bonding Curve Basics

The token bonding curve (TBC) mechanism is implemented by a smart contract that creates its own market without relying on exchanges. TBCs manage the buying and selling of "Continuous Tokens" (price is continuously calculated) with a mathematical formula that defines a relationship between price and token supply. When a person has purchased the token, each subsequent buyer will have to pay a slightly higher price for each token. As more people find out about the project and buying continues, the value of each token gradually increases along the bonding curve. The adaptive supply of a Continuous Token (tokens are newly minted when purchased and removed from circulation when sold) is a unique and enabling feature which allows for the supply to adjust to demand and for tokens to be continuously available for purchase at predictable prices.

Bonding curves are built upon one of the most fundamental concepts in economics: price being a function of supply and demand. This tried and tested economic law is the complex study of a more familiar adage: an asset is only worth what someone is willing to pay for it. Unlike stock markets where a single conversion can spike a stock arbitrarily higher or lower than its current price, the TBC is purely automated by the current state of "supply & demand". Traditionally, the process is overseen by a centralized entity; someone who oversees incoming buy and sell orders while matching market participants and ensuring liquidity.

TBCs can be designed with separate buy and sell curves to implement a spread between the two. The spread between the two curves results in funds raised by the community for use in achieving its goal. Some communities avoid the added complexity of implementing two curves by instituting a Tax on Buys and/or Sells. This alternative method of raising funds allows for more streamlined operations by simplifying the calculations required.

To summarize, the following are a list of TBC properties:

1. Instant liquidity. Tokens can be bought or sold instantaneously at any time as liquidity of its token is immediate and guaranteed. The TBC acts as an automated market maker holding enough reserves to buy tokens back at all times.
2. Continuous fundraising as the community can permissionlessly buy and sell the bonded tokens at any time.
3. Deterministic/continuous price - buy and sells are conducted at predictable prices based on a mathematical formula. The price of the current token is more than the last token issued, but less than the next token issued.
4. Limitless supply - There is no limit to the number of tokens that can be minted

The most fundamental advantage of Bonding Curves over traditional asset pricing mechanisms is that the pricing of assets is transparent, defined, and immutable at all stages. The TBC is able to reach the equilibrium of consensus through clearly defined rules, without third-party intervention. TBCs offer an innovative solution because they do not require the oversight of a centralized entity to create, oversee, and enforce the market's pursuit of this equilibrium.

## Tokens and US Securities Law

The Securities Act of 1933 and the Securities Exchange Act of 1934 impose strict regulations on the sale of "securities," defined broadly to include a wide range of instruments, including "investment contracts." The U.S. Supreme Court formulated what came to be called the "Howey test" (a set of four factors). If all four factors are present in a given instrument, it's an investment contract (and thus a security).

The four factors are:

1. An investment of money,
2. In a common enterprise,
3. With a reasonable expectation of profit,
4. Derived solely from the entrepreneurial or managerial efforts of others

The primary motivator to buy and sell LBUN is to provide for the burning of LUNC tokens. Community members interact with the smart contract in order to accelerate the rate at which LUNC is burned (2.4% vice 1.2% per transaction). The community should strive to make as many transactions as possible in order to meet its goal. Buy or Sell transactions will provide for the same 2.4% burn no matter where the price is located on the curve.

The TBC smart contract (called a "program" in Solana) is deployed on chain and operates autonomously. The smart contract follows a decentralized model and there is no person or promoter that is managing its operation. The TBC simply follows the mathematical formula automatically based on inputs and outputs by the community. Further, there is no person making any marketing efforts or providing materials to show reasonable expectations of profit. If the community stops supporting the TBC, its functionality ceases to exist due to the fact that community involvement is required. Any increase in the value of the LBUN token is strictly the result of community activity.

Other than the LUNC burn itself, the purchase of tokens provides the ability for community members to participate in raffles as a reward for holding LBUN. The tokens won via raffle should only go towards a status symbol and have no guaranteed value associated with them. For example, maybe the top 33% of token holders can display a "Gold badge" on social media to show that they helped more than others in the effort to meet the community's goal of LUNC burns. In this system, the middle 33% might get a "Silver badge" and the bottom 33% might get a "Bronze Badge".

Community members must understand that there are no entrepreneurial or managerial efforts provided by "others". The TBC is designed to be "sufficiently decentralized ... where purchasers would no longer reasonably expect a person or group to carry out essential managerial or entrepreneurial efforts". Stated another way, there are no Active Participants ("AP") that serve as "a promoter, sponsor, or other third party" to reasonably rely on for their profit.

No AP is available for:

1. the development, improvement (or enhancement), operation, or promotion of the network
2. to perform essential tasks or responsibilities. Instead, an unaffiliated, dispersed community of participants (a "decentralized" network) should perform those actions
3. creation or supporting a market for, or the price of, the digital asset
4. to function as a lead or central role in the direction of the ongoing development of the network or the digital asset
5. filling a continuing managerial role in making decisions about or exercising judgment concerning the network or the characteristics or rights the digital asset represents
6. the community participants to reasonably expect to undertake efforts to promote its own interests and enhance the value of the network or digital asset.

### To summarize:

Community participants SHOULD NOT EXPECT TO GAIN ANY PROFIT from this project. In fact, community members should expect a minimum loss of 6% (3% Buy tax plus 3% Sell tax). The purchase of LBUN is strictly for obtaining funds to support LUNC burning and for bragging rights.

The information in this section is **NOT** legal advice as the author is **NOT** a lawyer or otherwise well versed in law. The paragraphs in this section are merely an overview of various articles online.

## LBUN implementation

###

### LBUN Bonding Curve

The LBUN token is implemented using the Strata Protocol on the Solana blockchain. Strata makes it easy to build community tokens utilizing Bonding Curves. LBUN's TBC is defined by the following two mathematical formulas:

These formulas are power functions and as such can define our TBC in terms of a reserve ratio. This greatly simplifies the math needed to compute how much liquidity is stored in the Reserve. For LBUN's TBC, the applicable math is as follows (warning: complex math below):

In other words, the liquidity reserve for LBUN is one-third of the Market Cap (see Bancor Whitepaper or article by Slava Balasanov for complete explanation).

For example: at a 100,000 LBUN supply, the TBC price is 9.070295 SOL/LBUN:

- Market Cap is (100,000 LBUN \* 9.070295 SOL/LBUN) = 907,029.4785 SOL
- Liquidity Reserve = (1/3 \* 907,029.4785 SOL) = 302,343.1595 SOL

A summary of data points for a LBUN supply from 1 to 1.05M tokens follows:

![](RackMultipart20230114-1-8kdbjk_html_47e5acfd452956bf.png)

The following three charts illustrate the LBUN bonding curve. Three charts are used to capture the range of 1 to 1.05M LBUN tokens. The end of the last chart corresponds to a LBUN price of 1000 SOL for a burn fund contribution of 48 SOL. However, remember that community activity is the only method of moving along the curve. It is expected that the LBUN price point will continuously move thereby generating the funds to support the community driven LUNC burn.

![](RackMultipart20230114-1-8kdbjk_html_cde347991c21f288.png)

![](RackMultipart20230114-1-8kdbjk_html_e6fe0446ca8894fa.png)

![](RackMultipart20230114-1-8kdbjk_html_7e42860354f16ec2.png)

### LBUN Tax Details

The 6% difference between the Buy and Sell curves corresponds to the Buy Tax (3%) + Sell Tax (3%).

The Tax breakdown is as follows:

![](RackMultipart20230114-1-8kdbjk_html_eababef670c49edd.png)

The amount of funds raised can be computed via the use of Calculus. Specifically, the Integral of the Sell TBC is subtracted from the Integral of the Buy TBC. This equates to the 6% total tax specified earlier.

**Example #1** - The Tax amount generated when the LBUN supply is **176,500** is:

![](RackMultipart20230114-1-8kdbjk_html_235693eb919f4599.png)

The **100,803 SOL** collected are worth **$3,528,105** USD at today's prices ($35/SOL).

The breakdown is as follows:

![](RackMultipart20230114-1-8kdbjk_html_2e943aab8d6a46e6.png)

**Example #2** - The Tax amounts generated when the LBUN supply is **1,050,000** is:

![](RackMultipart20230114-1-8kdbjk_html_235693eb919f4599.png)

![](RackMultipart20230114-1-8kdbjk_html_7e0aa45563f08330.gif)

The **21,223,100 SOL** collected are worth **$**** 742,808,500** USD at today's prices ($35/SOL).

The breakdown is as follows:

![](RackMultipart20230114-1-8kdbjk_html_6cb2eaf658c21d9d.png)

A

###

In summary, each $1000 transacted (buy or sell) provides $24.00 for the LUNC burn, $5.00 for the raffle, $1.00 for expenses and $970 added/removed from the liquidity reserve.

### Community supported LUNC Burns

This project aims to conduct LUNC burns once a week utilizing the funds collected via the Buy and Sell tax during the previous 7 days. The LUNC burns will be conducted during the recording/airing of a YouTube video by a community member. This ensures that the community has evidence of the burn occurring. Additionally, some community members may choose to post updates on Twitter, Facebook, Instagram, Snapchat, TikTok, etc.

The amount of LUNC burned can be estimated by using the examples in the previous section and an assumed LUNC price of $0.0005. With 1,050,000 LBUN token in circulation, the collected Tax will burn about 1,188,493,600,000 LUNC! Obviously, the price of LUNC will change over time, but we can be sure that a large amount of LUNC will be burned via community efforts.

The conversion between SOL to LUNC will be based on the best exchange rates and liquidity of assets. The following are three possible methods of getting LUNC from Solana to its burn destination.

**Example #1** : SOL -\> UST -\> LUNC -\> Burn

1. Start by utilizing the funds (SOL) to purchase wrapped UST on Solana
2. Trade wrapped UST for wrapped LUNC on Solana
3. Bridged wrapped LUNC to Terra Classic via the Portal Protocol
4. Burn LUNC on Terra Classic chain

**Example #2** : SOL -\> BTC -\> LUNC -\> Burn

1. Start by utilizing the funds (SOL) to purchase wrapped BTC on Solana
2. Trade wrapped BTC for wrapped LUNC on Solana
3. Bridged wrapped LUNC to Terra Classic via the Portal Protocol
4. Burn LUNC on Terra Classic chain

**Example #3** : SOL -\> Large Exchange -\> LUNC -\> Burn

The SOL collected can also be directly used to buy LUNC at a large exchange (Binance, Kucoin, etc) where the supply of LUNC is plentiful (large liquidity). Buying LUNC there and burning would lead to an even higher amount of LUNC burned.

### LBUN TBC Transparency

The LBUN project seeks to maintain transparency by encouraging community members to monitor the accounts utilized. The accounts can be looked up in any Solana blockchain explorer such as SolScan ([https://solscan.io/](https://solscan.io/)), Solana Explorer ([https://explorer.solana.com](https://explorer.solana.com/)), Solana Beach ([https://solanabeach.io](https://solanabeach.io/) ), etc.

The following is the list of accounts are used on the **Devnet** for testing:

1. TBC Reserve (SOL Storage): 3wvd5p5aiiC5upv5W97uLdRaQYAJJiepXqWnmtz4RUbZ
2. TBC Target (LBUN Token): 9dzzzGn2yJhKTsozvzansFeH7roqN8W24TtbgxjAhXBU
3. TBC Buy Royalties (Buy Tax): HNtiVYvv5ccpMLjGHHX6hBXGjdJcvE4c1NE8NRPGTH5S
4. TBC Sell Royalties (Sell Tax): G33txKPpa67rStZQwhJJmzesHmYD7RCMTunFHbL7GGmT

The following is the list of accounts are used on the **Mainnet** :

1. TBC Reserve (SOL Storage): 9xJ7Sm3nWmxKLA5JdfJqTh4DPX9Eb1WRVjvHQL72J2gG
2. TBC Target (LBUN Token): 6Ngy7fpgovC8NasbBWLTJfEKb4tQJQfE9B5G5hDs9abm
3. TBC Buy Royalties (Buy Tax): 6F9eBZdSU1hb5HaDrf6fkgMjMx79MQdAfTi2FjdSopdH
4. TBC Sell Royalties (Sell Tax): gT6s6WrbdHEZk2eUi4M1HvWjYPPksquXgpHmBGcRFWU

## LBUN Raffles

###

### Raffle Basics

A raffle will be held weekly (depends on activity) to reward the LUNC community for utilizing the LBUN project. The winner of the raffle will be awarded all of the SOL deposited into the Raffle fund during the week.

The Raffle fund grows by receiving 1% of the total SOL amount transacted (during Buys and Sells) during the previous 7 days. The 1% funding the Raffle comes out of the 3% Buy and Sell tax. Therefore, the Raffle amount is likely to vary from week to week as it is generated solely by community activity in the LBUN project. This implementation creates a win-win situation (bigger LUNC burns = bigger SOL winnings) for the LUNC community.

All holders of LBUN will be automatically entered into the raffle that will be held immediately following the weekly LUNC burn. The wallet address of the Winner will be posted on Twitter.

### Raffle Rewards

The table below provides an estimation of the Raffle reward size for various amounts of tax collected:

![](RackMultipart20230114-1-8kdbjk_html_5e1c90bb48ded282.png)

### Raffle Odds Explained

The probability of winning a raffle is based on the LBUN held at the time of the raffle. Wallets will be sorted based on the balance held. Sorting by wallet address will be used when multiple wallets hold the same balance. The top 10% (largest balances) will be in Group A, next 20% in Group B, next 30% in Group C and the last 40% (smallest balances) in Group D. Group A will have the highest odds of winning while Group D will have the lowest. Within each group, the odds of be selected is 1/#wallets in that group. The final odds are those two probabilities multiplied together.

![](RackMultipart20230114-1-8kdbjk_html_e4a2756ee67a2183.png)

For example: With 75 wallets holding LBUN, the odds are as follows:

![](RackMultipart20230114-1-8kdbjk_html_4fb04a4fb732ff9e.png)

## Buying and Selling LBUN

###

### Using Strata App

**DevNet** - LBUN (dev) tokens (uses free test SOL) can be swapped on the Strata Protocol dAPP located at:

[https://app.strataprotocol.com/swap/9dzzzGn2yJhKTsozvzansFeH7roqN8W24TtbgxjAhXBU?cluster=devnet](https://app.strataprotocol.com/swap/9dzzzGn2yJhKTsozvzansFeH7roqN8W24TtbgxjAhXBU?cluster=devnet)

**Mainnet** - LBUN tokens (uses real SOL) can be swapped on the Strata Protocol dAPP located at:

[https://app.strataprotocol.com/swap/6Ngy7fpgovC8NasbBWLTJfEKb4tQJQfE9B5G5hDs9abm](https://app.strataprotocol.com/swap/6Ngy7fpgovC8NasbBWLTJfEKb4tQJQfE9B5G5hDs9abm)

![Shape1](RackMultipart20230114-1-8kdbjk_html_38635b4e47813f9a.gif)

### Phantom wallet

![](RackMultipart20230114-1-8kdbjk_html_74fc7a1944659672.png)

## Social Media

Social Media influences are encouraged to monitor and cover the weekly burns in order to share the progress with community members. Any communication channel (Youtube, Twitter, Discord, Medium, etc) may be used to spread the project's burn progress. Anyone interested in conducting a live burn on Youtube is welcomed to contact the author to obtain access to the burn funds.

# FAQs

1. Must I HODL LBUN in order to benefit the community?
  1. One can buy LBUN and then sell immediately. This will still generate a total of 4.8% towards LUNC burns. The total tax will be 6%, since 1.2% goes to the other four funds.

1. I want to help, but I just want to give a one-time contribution. How can I do that?
  1. Make a LBUN purchase and just leave it in your wallet forever. Most wallets allow you to hide the token so you don't have it cluttering up your wallet.

1. Can I pay for things with LBUN?
  1. Technically yes – but the other party will have to sell the LBUN to the TBC in order to swap it for SOL, and then BTC, ETH, etc.

1. How can I get other people (not LUNC community) to pay the 2.4% tax in order to help burn more LUNC?
  1. Send them LBUN instead of other currencies. That way they will have to pay the sell tax to get the currency they really want (BTC, ETH, etc).

1. Will I make money with LBUN?
  1. Most likely not. LBUN is for contributing to the LUNC burns. However, any LBUN you sell will be at the current TBC price. Nobody knows where that point will be on the curve ahead of time. One thing is for certain - you should NOT buy LBUN with money that you can not part with. This is crypto and the risk is extremely high that you will lose a part or all of your money.

# One last warning about crypto Currency

Putting money towards crypto currencies or projects is extremely risky. Before you buy LBUN (or any other crypto) ask yourself:

1. Did I pay the mortgage (or rent) and my monthly car payment?
2. Did I pay all of my monthly bills?
3. Did I pay for food for myself as well as for all my dependents?
4. Did I pay my medical bills?
5. Did I pay for my car or home repairs?
6. Did I pay my child support?
7. Did I contribute to my retirement fund?
8. Did I contribute to my child/children's college fund?
9. Did I put any money away into a safe (low risk) instrument?
10. Did I pay my taxes?

**Did I pay for everything I am responsible for?**

If the answer to **ANY** one of those questions is "No", then **STOP** buying crypto and go pay for the things that you are responsible for.

# References

What Really Happened To LUNA Crypto?, by: Forbes

[https://www.forbes.com/sites/qai/2022/09/20/what-really-happened-to-luna-crypto/#:~:text=When%20the%20Luna%20crypto%20network,assets%20stored%20in%20a%20bank](https://www.forbes.com/sites/qai/2022/09/20/what-really-happened-to-luna-crypto/#:~:text=When%20the%20Luna%20crypto%20network,assets%20stored%20in%20a%20bank)

Token Bonding Curves Explained, by: Justin Goro

[https://medium.com/coinmonks/token-bonding-curves-explained-7a9332198e0e](https://medium.com/coinmonks/token-bonding-curves-explained-7a9332198e0e)

Bonding Curves Explained, by: Yos Riady

[https://yos.io/2018/11/10/bonding-curves/](https://yos.io/2018/11/10/bonding-curves/)

How to Make Bonding Curves for Continuous Token Models, by: Slava Balasanov

[https://blog.relevant.community/how-to-make-bonding-curves-for-continuous-token-models-3784653f8b17](https://blog.relevant.community/how-to-make-bonding-curves-for-continuous-token-models-3784653f8b17)

Bonding Curves In Depth: Intuition & Parametrization, by: Slava Balasanov

[https://blog.relevant.community/bonding-curves-in-depth-intuition-parametrization-d3905a681e0a](https://blog.relevant.community/bonding-curves-in-depth-intuition-parametrization-d3905a681e0a)

Converting Between Bancor and Bonding Curve Price Formulas, by: Billy Rennekamp

[https://billyrennekamp.medium.com/converting-between-bancor-and-bonding-curve-price-formulas-9c11309062f5](https://billyrennekamp.medium.com/converting-between-bancor-and-bonding-curve-price-formulas-9c11309062f5)

The Augmented Bonding Curve, Part 1: A Web3 Way to Fund Public Goods, by: Commons Stack

[https://medium.com/commonsstack/the-augmented-bonding-curve-part-1-a-web3-way-to-fund-public-goods-7c9d1a871ae2](https://medium.com/commonsstack/the-augmented-bonding-curve-part-1-a-web3-way-to-fund-public-goods-7c9d1a871ae2)

Deep Dive: Augmented Bonding Curves, by: Abbey Titcomb

[https://medium.com/giveth/deep-dive-augmented-bonding-curves-3f1f7c1fa751](https://medium.com/giveth/deep-dive-augmented-bonding-curves-3f1f7c1fa751)

Sponsored Burning for TCR, by: Alex Van de Sande

[https://avsa.medium.com/sponsored-burning-for-tcr-c0ab08eef9d4](https://avsa.medium.com/sponsored-burning-for-tcr-c0ab08eef9d4)

How Token Bonding Curves Help Bootstrap an Economy, by: RLY Network

[https://rly.network/how-token-bonding-curves-help-bootstrap-an-economy/](https://rly.network/how-token-bonding-curves-help-bootstrap-an-economy/)

Bonding Curves, by: Strata Protocol

[https://docs.strataprotocol.com/learn/bonding\_curves](https://docs.strataprotocol.com/learn/bonding_curves)

Sustainable & Ethical Design for Token Ecosystems, by: Token Engineering Commons

[https://tecommons.org/](https://tecommons.org/)

What are Bonding Curve Offerings?, by: @tradingbull

[https://hackernoon.com/what-are-bonding-curve-offerings-xi2k34bm](https://hackernoon.com/what-are-bonding-curve-offerings-xi2k34bm)

Social Tokens and US Securities Law, by: Strata Protocol

[https://blog.strataprotocol.com/us-social-token-law](https://blog.strataprotocol.com/us-social-token-law)

An introduction to bonding curves, shapes and use cases, by: Veronica Coutts

[https://medium.com/linum-labs/intro-to-bonding-curves-and-shapes-bf326bc4e11a](https://medium.com/linum-labs/intro-to-bonding-curves-and-shapes-bf326bc4e11a)

Solana vs. Ethereum: An Ultimate Comparison, by: Iulia Vasile

[https://beincrypto.com/learn/solana-vs-ethereum/](https://beincrypto.com/learn/solana-vs-ethereum/)

Strata Protocol Riptide Hackathon Submission 2022 (video), by Strata

[https://www.youtube.com/watch?v=xZUhb06JKM0](https://www.youtube.com/watch?v=xZUhb06JKM0)

![Shape2](RackMultipart20230114-1-8kdbjk_html_e5275c83f350ddb7.gif)

**----- LBUN : Twice the Burn -----**