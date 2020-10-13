
#include <iostream>
#include <string>
using namespace std;
int main()
{
  int t, n, m;
  cout<<"tests"<<endl;
  cin>>t;
  
  
  for(;t>0;t--)
  {
      cout<<endl<<"friends"<<endl;
      cin>>n;
      cout<<endl<<"chocolates in packet"<<endl;
      cin>>m;
      
      if(m%n==0)
      cout<<endl<<"YES";
      else
      cout<<endl<<"NO";
  }
}
      
  

