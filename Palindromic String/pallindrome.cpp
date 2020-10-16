// Example program
#include <iostream>
#include <string>
using namespace std;
int main()
{
  cout<<"enter string"<<endl;
  string n;
  cin>>n; int c=0;
  if(n.length()==1)
  cout<<"YES";
  else{
  for(int i=0;i<n.length()/2;i++)
  {
      if(n[i]!=n[n.length()-1-i])
     { cout<<"NO"; 
       c=0;
       break; }
      else c=1;
  }
  if(c==1)
  cout<<"YES";
 }
      
  
}
