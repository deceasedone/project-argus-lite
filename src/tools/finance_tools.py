# src/tools/finance_tools.py

import yfinance as yf

def get_stock_info(ticker: str) -> str:
    """Fetches key financial metrics for a given stock ticker."""
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # Extracting relevant financial data
        metrics = {
            "Company": info.get("shortName", ticker),
            "Sector": info.get("sector", "N/A"),
            "Current Price": info.get("currentPrice", "N/A"),
            "52 Week High": info.get("fiftyTwoWeekHigh", "N/A"),
            "52 Week Low": info.get("fiftyTwoWeekLow", "N/A"),
            "Market Cap": info.get("marketCap", "N/A"),
            "PE Ratio": info.get("trailingPE", "N/A"),
            "Forward PE": info.get("forwardPE", "N/A"),
            "Dividend Yield": info.get("dividendYield", "N/A")
        }
        
        # Format as a clean string for the LLM
        result = f"Financial Metrics for {ticker}:\n"
        for key, value in metrics.items():
            result += f"- {key}: {value}\n"
        return result
    except Exception as e:
        return f"Error fetching stock info for {ticker}: {str(e)}"

def get_stock_news(ticker: str) -> str:
    """Fetches the latest news headlines for a given stock ticker."""
    try:
        stock = yf.Ticker(ticker)
        news = stock.news
        
        if not news:
            return f"No recent news found for {ticker}."
            
        result = f"Recent News for {ticker}:\n"
        # Get top 3 news articles
        for article in news[:3]:
            result += f"- Title: {article.get('title')}\n"
            result += f"  Publisher: {article.get('publisher')}\n"
            result += f"  Link: {article.get('link')}\n\n"
        return result
    except Exception as e:
        return f"Error fetching news for {ticker}: {str(e)}"