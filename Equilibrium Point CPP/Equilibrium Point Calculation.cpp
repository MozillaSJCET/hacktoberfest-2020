#include <iostream>
using namespace std;

int main() {
    int t;
    cin>>t;
    while(t--)
    {
        int n, i, j, sum1=0, sum2=0, c=0;
        cin>>n;
        int arr[n];
        for(i=0; i<n; i++)
        cin>>arr[i];
        for(i=0; i<n-2; i++)
        {
            sum1=sum1+arr[i];
            //cout<<sum1<<endl;
            sum2=0;
            for(j=n-1; j>i+1; j--)
            {
                sum2=sum2+arr[j];
                //cout<<sum2<<endl;
                if(sum1==sum2 && i+1==j-1)
                {
                c++;
                cout<<j<<endl;
                }
                
            }
        }
        if(c==0 && n!=1)
        cout<<"-1"<<endl;
        if(n==1)
        cout<<"1"<<endl;
        
    }
	return 0;
}

