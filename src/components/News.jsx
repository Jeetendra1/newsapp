import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: "6",
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.string,
    category: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      pages: 1,
      loading: false,
      totalResults: 0
    };
    document.title = this.props.category;
  }
  async updateNews() {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=6b83216f791f43acb31f2d64554dcb5b&page=${this.state.pages}&pageSize=${this.props.pageSize}`;
    this.setState({
      loading: true,
    });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(60);
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      pages: this.state.pages,
      loading: false,
    });
    this.props.setProgress(100);
  }
   fetchMoreData = async () => {
    this.setState({pages: this.state.pages + 1 });
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=6b83216f791f43acb31f2d64554dcb5b&page=${this.state.pages}&pageSize=${this.props.pageSize}`;
    this.setState({
      loading: true,
    });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat((parsedData.articles)),
      totalResults: parsedData.totalResults,
      pages: this.state.pages,
      loading: false,
    });
  };
  async componentDidMount() {
    this.updateNews();
  }
  clickOnPreviousPages = async () => {
    this.setState({
      pages: this.state.pages - 1,
    });
    this.updateNews();
  };
  clickOnNextPages = async () => {
    this.setState({
      pages: this.state.pages + 1,
    });
    this.updateNews();
  };
  render() {
    return (
      <>
        <div className="container my-3">
          <h2> New Monkey- Top Headlines</h2>
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={<Spinner />}
          >
            <div className="row">
              {/* {this.state.loading && <Spinner />} */}

              {this.state.articles.map((element, index) => {
                return (
                  <div key={index} className="col-md-4">
                    <NewsItem
                      title={element.title}
                      description={element.description}
                      imageUrl={element.urlToImage}
                      newsURL={element.url}
                    />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
        {/* <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.pages <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.clickOnPreviousPages}
          >
            Previous
          </button>
          <button
            disabled={
              this.state.pages + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.clickOnNextPages}
          >
            Next
          </button>
        </div> */}
      </>
    );
  }
}

export default News;
