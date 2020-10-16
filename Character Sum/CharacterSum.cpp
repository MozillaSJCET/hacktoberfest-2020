
#include <iostream>
#include <string>
using namespace std;
int main()
{
  string s;
  cout<<"string"<<endl;
  cin>>s;
  int n=0;
  
  for(int i=0;i<s.length();i++)
  {
      n=n+ ((int)s[i]-(int)'a' +1);
  }
  cout<<endl<<n;
}
      
  

